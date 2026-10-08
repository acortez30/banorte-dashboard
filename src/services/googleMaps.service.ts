const GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api/js";

export const googleMapsService = {

  async loadGoogleMaps(): Promise<any> {

    const win = window as any;

    if (win.google && win.google.maps) {
      return win.google.maps;
    }

    return new Promise((resolve, reject) => {

      const script = document.createElement("script");

      script.src = `${GOOGLE_MAPS_API}?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;

      script.async = true;
      script.defer = true;

      document.body.appendChild(script);

      script.onload = () => {

        if (win.google && win.google.maps) {
          resolve(win.google.maps);
        } else {
          reject("Google Maps SDK not available");
        }

      };

    });

  },

  async geocodeLocation(address: string) {

    return new Promise((resolve, reject) => {

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {

        if (status === "OK" && results[0]) {
          resolve(results[0]);
        } else {
          reject(`Geocode error: ${status}`);
        }

      });

    });

  }

};