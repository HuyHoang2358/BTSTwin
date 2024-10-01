interface Window {
  potreeViewer?: any; // Hoặc thay thế `any` bằng kiểu dữ liệu cụ thể nếu bạn biết loại của `potreeViewer`
  triggerStationClick: boolean;
  cesiumViewer?: any;
}

declare namespace Potree {
  class Viewer {
    constructor(element: HTMLElement);
    setEDLEnabled(enabled: boolean): void;
    setFOV(fov: number): void;
    loadSettingsFromURL(): void;
    setBackground(color: string): void;
    setPointBudget(budget: number): void;
    useHQ: boolean;
    compass: { setVisible(visible: boolean): void };
    scene: {
      addEventListener(event: string, callback: Function): void;
    };
  }

  namespace ClipTask {
    const SHOW_OUTSIDE: number;
  }

  namespace Utils {
    function moveTo(a, b, c): any;
    function getMeasurementIcon(e): string;
    function addCommas(e): any;
  }

  class BoxVolume {
    position: any;
    rotation: any;
    scale: any;
    visible: boolean;
    clip: boolean;
  }

  function loadPointCloud(url: string, name: string, cb: (e: any) => void): void;

  namespace PointSizeType {
    const ADAPTIVE: any;
  }

  namespace PointShape {
    const SQUARE: any;
  }
}
