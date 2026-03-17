import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Lock,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddDriver,
  useAllBookings,
  useAllDrivers,
  useDeleteDriver,
  useIsAdmin,
  useUpdateBookingStatus,
  useUpdateDriverAvailability,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    [BookingStatus.pending]: "status-pending",
    [BookingStatus.confirmed]: "status-confirmed",
    [BookingStatus.completed]: "status-completed",
    [BookingStatus.cancelled]: "status-cancelled",
  };
  return <Badge className={`border ${map[status]} capitalize`}>{status}</Badge>;
}

export default function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: bookings, isLoading: bookingsLoading } = useAllBookings();
  const { data: drivers, isLoading: driversLoading } = useAllDrivers();
  const updateStatus = useUpdateBookingStatus();
  const updateAvailability = useUpdateDriverAvailability();
  const deleteDriver = useDeleteDriver();
  const addDriver = useAddDriver();

  const [newDriver, setNewDriver] = useState({
    name: "",
    photo: "",
    experienceYears: "5",
    languages: "English, Hindi",
    rating: "4.5",
    pricePerHour: "500",
    description: "",
  });

  const updateField = (field: string, value: string) =>
    setNewDriver((prev) => ({ ...prev, [field]: value }));

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDriver.mutateAsync({
        name: newDriver.name,
        photo: newDriver.photo,
        experienceYears: BigInt(newDriver.experienceYears),
        languages: newDriver.languages.split(",").map((l) => l.trim()),
        rating: Number(newDriver.rating),
        pricePerHour: BigInt(newDriver.pricePerHour),
        description: newDriver.description,
      });
      toast.success("Driver added successfully!");
      setNewDriver({
        name: "",
        photo: "",
        experienceYears: "5",
        languages: "English, Hindi",
        rating: "4.5",
        pricePerHour: "500",
        description: "",
      });
    } catch {
      toast.error("Failed to add driver");
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "oklch(0.26 0.07 255)" }}
        >
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-3">
          Admin Access Required
        </h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access the admin dashboard.
        </p>
        <Button
          onClick={login}
          disabled={loginStatus === "logging-in"}
          className="bg-primary text-primary-foreground w-full"
          data-ocid="admin.primary_button"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12"
        data-ocid="admin.loading_state"
      >
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have admin privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage bookings and drivers</p>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" data-ocid="admin.bookings_tab">
              All Bookings {bookings && `(${bookings.length})`}
            </TabsTrigger>
            <TabsTrigger value="drivers" data-ocid="admin.drivers_tab">
              Manage Drivers {drivers && `(${drivers.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="shadow-card">
              <CardContent className="p-0">
                {bookingsLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="admin.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : !bookings || bookings.length === 0 ? (
                  <div
                    className="p-12 text-center text-muted-foreground"
                    data-ocid="admin.booking.empty_state"
                  >
                    No bookings yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.booking.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Driver ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking, i) => (
                          <TableRow
                            key={booking.id.toString()}
                            data-ocid={`admin.booking.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-sm">
                              #{booking.id.toString()}
                            </TableCell>
                            <TableCell className="font-medium">
                              {booking.customerName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {booking.customerPhone}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              #{booking.driverId.toString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(
                                Number(booking.date),
                              ).toLocaleDateString("en-IN")}
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₹{Number(booking.totalPrice)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={booking.status} />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={async (v) => {
                                  try {
                                    await updateStatus.mutateAsync({
                                      id: booking.id,
                                      status: v as BookingStatus,
                                    });
                                    toast.success("Status updated");
                                  } catch {
                                    toast.error("Failed to update status");
                                  }
                                }}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(BookingStatus).map((s) => (
                                    <SelectItem
                                      key={s}
                                      value={s}
                                      className="text-xs capitalize"
                                    >
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Driver List */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Driver List
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {driversLoading ? (
                    <div data-ocid="admin.loading_state">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : !drivers || drivers.length === 0 ? (
                    <p
                      className="text-muted-foreground text-sm text-center py-6"
                      data-ocid="admin.driver.empty_state"
                    >
                      No drivers yet.
                    </p>
                  ) : (
                    drivers.map((driver, i) => (
                      <div
                        key={driver.id.toString()}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                        data-ocid={`admin.driver.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: "oklch(0.26 0.07 255)" }}
                          >
                            {driver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{driver.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{Number(driver.pricePerHour)}/hr ·{" "}
                              {driver.rating.toFixed(1)}★
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                await updateAvailability.mutateAsync({
                                  id: driver.id,
                                  available: !driver.available,
                                });
                                toast.success(
                                  `Driver ${driver.available ? "set unavailable" : "set available"}`,
                                );
                              } catch {
                                toast.error("Failed to update");
                              }
                            }}
                            className={
                              driver.available
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }
                          >
                            {driver.available ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            data-ocid={`admin.driver.delete_button.${i + 1}`}
                            onClick={async () => {
                              try {
                                await deleteDriver.mutateAsync(driver.id);
                                toast.success("Driver deleted");
                              } catch {
                                toast.error("Failed to delete driver");
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Add Driver Form */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add New Driver
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddDriver} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="Driver name"
                          value={newDriver.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          required
                          data-ocid="admin.driver.input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Experience (years)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={newDriver.experienceYears}
                          onChange={(e) =>
                            updateField("experienceYears", e.target.value)
                          }
                          required
                          data-ocid="admin.driver.input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price/Hour (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={newDriver.pricePerHour}
                          onChange={(e) =>
                            updateField("pricePerHour", e.target.value)
                          }
                          required
                          data-ocid="admin.driver.input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Rating (0-5)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={newDriver.rating}
                          onChange={(e) =>
                            updateField("rating", e.target.value)
                          }
                          required
                          data-ocid="admin.driver.input"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Languages (comma separated)
                      </Label>
                      <Input
                        placeholder="English, Hindi, Tamil"
                        value={newDriver.languages}
                        onChange={(e) =>
                          updateField("languages", e.target.value)
                        }
                        data-ocid="admin.driver.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Photo URL (optional)</Label>
                      <Input
                        placeholder="https://..."
                        value={newDriver.photo}
                        onChange={(e) => updateField("photo", e.target.value)}
                        data-ocid="admin.driver.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input
                        placeholder="Brief description..."
                        value={newDriver.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        required
                        data-ocid="admin.driver.input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground"
                      disabled={addDriver.isPending}
                      data-ocid="admin.driver.save_button"
                    >
                      {addDriver.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" /> Add Driver
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
