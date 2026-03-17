declare module "leaflet" {
  namespace L {
    interface LatLng {
      lat: number;
      lng: number;
    }
    interface Map {
      remove(): void;
      setView(center: [number, number] | LatLng, zoom: number): Map;
      getZoom(): number;
      on(event: string, handler: (...args: any[]) => void): Map;
      off(event: string, handler?: (...args: any[]) => void): Map;
    }
    interface Marker {
      setLatLng(latlng: [number, number] | LatLng): Marker;
      addTo(map: Map): Marker;
      remove(): void;
    }
    interface TileLayer {
      addTo(map: Map): TileLayer;
    }
    interface DivIcon {}
    namespace Icon {
      namespace Default {
        const prototype: any;
        function mergeOptions(opts: any): void;
      }
    }
    function map(el: HTMLElement, options?: any): Map;
    function tileLayer(url: string, options?: any): TileLayer;
    function marker(latlng: [number, number] | LatLng, options?: any): Marker;
    function icon(options: any): any;
    function divIcon(options: any): DivIcon;
    function latLng(lat: number, lng: number): LatLng;
  }
  export = L;
}

declare module "leaflet/dist/leaflet.css" {
  const content: string;
  export default content;
}
