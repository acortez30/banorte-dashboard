type GoogleMapData = {
  lat: number;
  lng: number;
  zoom: number;
};

type Listener = (data: GoogleMapData) => void;

class SharedService {

  private listeners: Listener[] = [];

  sendClickEvent(lat: number, lng: number, zoom: number) {

    const data = { lat, lng, zoom };

    this.listeners.forEach((listener) => listener(data));
  }

  subscribe(listener: Listener) {

    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };

  }

}

export const sharedService = new SharedService();