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
      addEventListener(event: string, callback: any): void;
    };
  }

  namespace ClipTask {
    const SHOW_OUTSIDE: number;
  }

  namespace Utils {
    function moveTo(a, b, c): any;
    function getMeasurementIcon(e): string;
    function addCommas(e): any;
    function computeCircleCenter(a, b, c): any;
    function computeAzimuth(a, b, c): any;
  }

  class BoxVolume {
    position: any;
    rotation: any;
    scale: any;
    visible: boolean;
    clip: boolean;
  }

  class Measure {
    constructor(viewer?: any);
    uuid: string;
    name: string;
    showDistances: boolean;
    showCoordinates: boolean;
    showArea: boolean;
    showAngles: boolean;
    closed: boolean;
    showHeight: boolean;
    showCircle: boolean;
    showAzimuth: boolean;
    showEdges: boolean;
    addMarker(pos: any): void;
  }

  function loadPointCloud(url: string, name: string, cb: (e: any) => void): void;

  function saveProject(viewer: any): object;

  namespace PointSizeType {
    const ADAPTIVE: any;
  }

  namespace PointShape {
    const SQUARE: any;
  }
}
