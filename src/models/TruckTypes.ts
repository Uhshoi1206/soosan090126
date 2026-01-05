import { getBoxTypeName as getBoxTypeNameFromGenerated, getTrailerTypeName as getTrailerTypeNameFromGenerated } from '@/lib/generated/categories';

export type VehicleType = string;

export interface TruckBrand {
  id: number;
  name: string;
}

export interface TruckWeight {
  id: number;
  name: string;
  minWeight: number;
  maxWeight: number;
  value?: number | string; // Thêm thuộc tính value để hỗ trợ mã trong useTruckFilters
}

export interface TruckFilters {
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  vehicleType: VehicleType | null;
  search: string | null;
  boxType: string | null;
  trailerType: string | null;
}

// Chi tiết kết cấu thùng cho xe tải thùng đông lạnh, bảo ôn
export interface CoolingBoxStructure {
  wallLayers?: number;
  wallMaterials?: string[];
  floorLayers?: number;
  floorMaterials?: string[];
  roofLayers?: number;
  roofMaterials?: string[];
  doorType?: string;
  insulationThickness?: string;
  refrigerationSystem?: string;
  temperatureRange?: string;

  // Thêm các thông số chi tiết hơn cho thùng đông lạnh
  coolingUnit?: string;        // Đơn vị làm lạnh
  compressorType?: string;     // Loại máy nén
  refrigerantType?: string;    // Loại môi chất lạnh
  temperatureControl?: string; // Hệ thống điều khiển nhiệt độ
  doorSize?: string;           // Kích thước cửa
  doorCount?: number;          // Số lượng cửa
  insideHeight?: number;       // Chiều cao bên trong thùng
  insideWidth?: number;        // Chiều rộng bên trong thùng
  insideLength?: number;       // Chiều dài bên trong thùng
  outsideMaterial?: string;    // Vật liệu bên ngoài
  insideMaterial?: string;     // Vật liệu bên trong
  floorMaterial?: string;      // Vật liệu sàn
  loadingSecurity?: string;    // Hệ thống an toàn hàng hóa
}

// Chi tiết về thùng bảo ôn
export interface InsulatedBoxStructure {
  wallThickness?: string;      // Độ dày vách
  floorThickness?: string;     // Độ dày sàn
  roofThickness?: string;      // Độ dày mái
  insulationMaterial?: string; // Vật liệu cách nhiệt
  outerMaterial?: string;      // Vật liệu bên ngoài
  innerMaterial?: string;      // Vật liệu bên trong
  doorType?: string;           // Loại cửa
  doorCount?: number;          // Số lượng cửa
  temperatureRange?: string;   // Phạm vi nhiệt độ duy trì
  insideDimension?: string;    // Kích thước bên trong
  loadingCapacity?: string;    // Khả năng chịu tải
}

// Chi tiết về thùng kín
export interface ClosedBoxStructure {
  frameStructure?: string;     // Cấu trúc khung
  panelMaterial?: string;      // Vật liệu panel
  thickness?: string;          // Độ dày
  doorType?: string;           // Loại cửa
  doorCount?: number;          // Số lượng cửa
  roofType?: string;           // Loại mái
  floorMaterial?: string;      // Vật liệu sàn
  loadingSecurity?: string;    // Hệ thống an toàn hàng hóa
  reinforcement?: string;      // Gia cường
  waterproofing?: string;      // Chống thấm nước
}

// Chi tiết về thùng bạt
export interface TarpaulinBoxStructure {
  frameStructure?: string;     // Cấu trúc khung
  tarpaulinMaterial?: string;  // Vật liệu bạt
  tarpaulinThickness?: string; // Độ dày bạt
  frameType?: string;          // Loại khung
  sideAccess?: boolean;        // Khả năng tiếp cận từ bên hông
  coverType?: string;          // Loại mui phủ
  floorMaterial?: string;      // Vật liệu sàn
}

// Chi tiết về thùng lửng
export interface FlatbedStructure {
  floorMaterial?: string;      // Vật liệu sàn
  sideHeight?: number | string; // Chiều cao thành bên (có thể là số hoặc chuỗi như "1.3-1.6m")
  sideType?: string;           // Loại thành bên
  sideAccess?: string;         // Khả năng tiếp cận bên hông
  floorThickness?: string;     // Độ dày sàn
  reinforcement?: string;      // Gia cường
}

// Chi tiết về bồn xi téc
export interface TankSpecification {
  capacity?: number | string;   // Dung tích (có thể là số hoặc text)
  capacityText?: string;
  compartments?: number;
  material?: string;            // Vật liệu bồn (Inox 316L, etc.)
  thickness?: string;           // Độ dày thành bồn
  tankDimension?: string;       // Kích thước bồn (ĐK x Dài)
  designPressure?: string;      // Áp suất thiết kế
  testPressure?: string;        // Áp suất thử nghiệm
  workingTemperature?: string;  // Nhiệt độ làm việc
  baffles?: string;             // Tấm chắn sóng bên trong
  manholeSize?: string;         // Đường kính lỗ đôm
  valveSystem?: string;         // Hệ thống van
  valveType?: string;           // Loại van (van bướm, etc.)
  pressureRating?: string;
  dischargingSystem?: string;   // Hệ thống xả
  dischargePipe?: string;       // Đường ống xả
  pumpType?: string;            // Loại bơm
  pumpFlowRate?: string;        // Lưu lượng bơm
  flowMeter?: string;           // Đồng hồ đo lưu lượng
  liningMaterial?: string;      // Vật liệu lót trong
  safetyEquipment?: string;     // Thiết bị an toàn
  safetyFeatures?: string;      // Tính năng an toàn
  insulationPresent?: boolean;  // Có cách nhiệt không
  heatingSystem?: string;       // Hệ thống làm nóng
  measurementSystem?: string;   // Hệ thống đo lường
  certifications?: string;      // Tiêu chuẩn chứng nhận
}

// Chi tiết về cẩu
export interface CraneSpecification {
  liftingCapacity?: number; // Sức nâng lớn nhất (kg)
  liftingCapacityText?: string; // Hiển thị dạng text (ví dụ: 10,000 kg / 2.0 m)
  maxLiftingMoment?: string; // Moment nâng lớn nhất (tấn.m)
  maxLiftingHeight?: string; // Chiều cao nâng lớn nhất (m)
  maxHeightBelowGround?: string; // Chiều cao nâng dưới mặt đất (m)
  maxWorkingRadius?: string; // Bán kính làm việc lớn nhất (m)
  minWorkingRadius?: string; // Bán kính làm việc nhỏ nhất (m)
  applicableTruckChassis?: string; // Xe chassis phù hợp (tải trọng)
  craneOperatingWeight?: string; // Trọng lượng vận hành cẩu (kg)
  craneNetWeight?: string; // Trọng lượng thân cẩu (kg)

  // Thông số cần cẩu (Boom)
  boomType?: string; // Loại cần (ví dụ: Cần lục giác)
  boomSections?: number; // Số đoạn cần
  boomLength?: string; // Chiều dài cần (m) - ví dụ: 5.6 m ~ 21.8 m
  boomExtensionSpeed?: string; // Tốc độ ra cần (m/s) - ví dụ: 16.25 / 40 (m/s)
  boomLuffingAngle?: string; // Góc nâng cần (độ) - ví dụ: 0° ~ 80°
  boomLuffingSpeed?: string; // Tốc độ nâng cần (độ/s) - ví dụ: 1 ~ 80 / 18 (°/s)

  // Thông số tời (Winch)
  winchRatedSpeed?: string; // Tốc độ tời định mức (m/phút) - ví dụ: 16 (m/phút) (tại lớp thứ 4)
  winchHookSpeed?: string; // Tốc độ móc tời (m/phút)
  winchRopeType?: string; // Loại cáp tời (ø x m) - ví dụ: 10 x 120 IWRC 6xWS(26)
  winchSingleLinePull?: string; // Lực kéo đơn (kgf)
  winchBrakingStrength?: string; // Lực phanh cáp (kgf)
  sheaveBlockCapacity?: string; // Sức nâng khối ròng rọc (kgf)
  sheaveBlockType?: string; // Loại khối ròng rọc (số puly, chốt an toàn)

  // Thông số xoay (Swing)
  swingAngle?: string; // Góc xoay (độ) - ví dụ: 360° liên tục
  swingSpeed?: string; // Tốc độ xoay (vòng/phút) - ví dụ: 2.0 (rpm)
  swingReductionType?: string; // Kiểu giảm tốc xoay - ví dụ: Bánh răng trục vít, mô tơ thủy lực

  // Chân chống (Outriggers)
  outriggersFrontExtension?: string; // Chân chống trước - Mở rộng tối đa (m)
  outriggersRearExtension?: string; // Chân chống sau - Mở rộng tối đa (m)
  outriggersType?: string; // Loại chân chống - ví dụ: Mô tơ thủy lực, bánh răng nêm và hộp giảm tốc hành tinh
  outriggersVerticalJacks?: string; // Kích đứng chân chống
  outriggersHorizontalBeams?: string; // Dầm ngang chân chống

  // Hệ thống thủy lực (Hydraulic System)
  hydraulicPumpType?: string; // Loại bơm thủy lực
  hydraulicTankCapacity?: string; // Dung tích thùng dầu thủy lực (L) - ví dụ: 65 Lít
  hydraulicOilFlow?: string; // Lưu lượng dầu thủy lực (L/phút) - ví dụ: 65 (L/phút)
  hydraulicOperatingPressure?: string; // Áp suất vận hành thủy lực (kg/cm²) - ví dụ: 210 (kg/cm²)
  hydraulicRatedRevolution?: string; // Tốc độ quay bơm định mức (rpm)
  hydraulicReliefValvePressure?: string; // Áp suất van xả (kg/cm²)
  hydraulicCounterBalanceValve?: string; // Van cân bằng
  hydraulicPilotCheckValve?: string; // Van kiểm tra pilot
  hydraulicMotorHoisting?: string; // Mô tơ thủy lực nâng
  hydraulicMotorSlewing?: string; // Mô tơ thủy lực xoay
  hydraulicCylinders?: string; // Xi lanh thủy lực (số lượng và loại)

  // Các thông số cũ nếu vẫn cần thiết
  reachLength?: number; // Tầm với (m) - có thể thay bằng maxWorkingRadius
  reachLengthText?: string;
  rotationAngle?: string; // Đã có swingAngle
  stabilizers?: string; // Đã có outriggers...
  controlSystem?: string; // Hệ thống điều khiển
  operatingPressure?: string; // Đã có hydraulicOperatingPressure
  mountingType?: string;
  cabinPresent?: boolean;
  remoteControl?: boolean;
  maxWorkingHeight?: string; // Đã có maxLiftingHeight
  foldedHeight?: string;
  powerSource?: string;
  safetySystem?: string;
  winchCapacity?: string; // Có thể hiển thị chi tiết hơn ở winchRatedSpeed, winchHookSpeed
  optionalFeatures?: string[]; // Tính năng tùy chọn (giỏ nâng người, điều khiển từ xa, AML...)

  // Thông tin bổ sung (lấy từ hình ảnh)
  craneModelName?: string; // Tên model cẩu, ví dụ: SOOSAN SCS1015LS
  detailedLiftingCapacity?: string[]; // Chi tiết tải trọng nâng theo tầm với, ví dụ: ["8,000 kg / 2.5 m", "2,050 kg / 6.0 m", ...]
}

// Chi tiết về sơ mi rơ mooc
export interface TrailerSpecification {
  axleCount?: number;
  axleType?: string;
  axleWeight?: number;
  kingpinLoad?: number;
  suspensionType?: string;
  brakeSystem?: string;
  floorType?: string;
  floorThickness?: string;
  sideHeight?: number | string; // Cho phép cả number và string
  rampType?: string;
  extensionLength?: number;
  totalLength?: string;          // Chiều dài tổng thể
  wheelbase?: string;            // Khoảng cách trục bánh
  loadingHeight?: string;        // Chiều cao sàn
  turningRadius?: string;        // Bán kính quay vòng
  hydraulicSystem?: string;      // Hệ thống thủy lực (cho mooc ben)
  liftingAngle?: string;         // Góc nâng (cho mooc ben)
  dumpingTime?: string;          // Thời gian đổ (cho mooc ben)
  containerLock?: string;        // Khóa container (cho mooc xương)
  containerDimensions?: string;  // Kích thước lòng thùng (cho mooc ben)
  paintProcess?: string;         // Quy trình sơn
  paintColor?: string;           // Màu sơn
  paintTechnology?: {            // Công nghệ sơn (gộp quy trình và màu)
    paintProcess?: string;       // Quy trình sơn
    paintColor?: string;         // Màu sơn
  };
  tireSpec?: string;             // Thông số lốp
  electricSystem?: string;       // Hệ thống điện
  specialFeatures?: string[];    // Tính năng đặc biệt
}

// Chi tiết về đầu kéo
export interface TractorSpecification {
  horsepower?: number;
  torque?: string;
  transmission?: string;
  transmissionType?: string;
  clutchType?: string;
  cabinType?: string;
  wheelbase?: number;
  fuelTankCapacity?: number;
  fuelTankCapacityText?: string;
  saddleHeight?: number;
  fifthWheelType?: string;
  maxTowingCapacity?: number;
  maxTowingCapacityText?: string;
  brakingSystem?: string;        // Hệ thống phanh
  retarderSystem?: string;       // Hệ thống hãm
  sleepingBerth?: boolean;       // Có giường nằm không
  axleConfiguration?: string;    // Cấu hình trục (6x4, 4x2, etc.)
  interiorFeatures?: string[];   // Tính năng nội thất
  airConditioner?: boolean;      // Có điều hòa không
  electricSystem?: string;       // Hệ thống điện
}

// Chi tiết về hệ thống khoan (máy khoan cọc nhồi)
export interface DrillingSystemSpec {
  maxDiameter?: string;        // Đường kính khoan tối đa
  maxDepth?: string;           // Độ sâu khoan tối đa
  maxTorque?: string;          // Mô-men xoắn tối đa
  rotationSpeed?: string;      // Tốc độ quay
  crowdForce?: string;         // Lực đẩy xuống
  pullbackForce?: string;      // Lực kéo lên
  kellyBarType?: string;       // Loại cần Kelly
  hydraulicPressure?: string;  // Áp suất thủy lực
  feedStroke?: string;         // Hành trình cấp
}

// Chi tiết về hệ thống thang cứu hộ
export interface LadderSystemSpec {
  maxHeight?: string;          // Chiều cao nâng tối đa
  maxRadius?: string;          // Bán kính làm việc
  elevationAngle?: string;     // Góc nâng thang
  rotationAngle?: string;      // Góc quay thang
  ladderSections?: string;     // Số đốt thang
  basketCapacity?: string;     // Sức nâng giỏ
  basketControls?: string;     // Điều khiển giỏ
  outriggerSpan?: string;      // Khẩu độ chân chống
  groundSlope?: string;        // Độ nghiêng cho phép
  hydraulicPressure?: string;  // Áp suất thủy lực
  pumpCapacity?: string;       // Lưu lượng bơm
}

// Chi tiết về hệ thống rải dây thép gai
export interface WireDispenserSpec {
  deploymentSpeed?: string;    // Tốc độ rải
  wireCapacity?: string;       // Sức chứa dây
  wireTypes?: string;          // Loại dây tương thích
  barrierLayers?: string;      // Số lớp hàng rào
  barrierHeight?: string;      // Chiều cao hàng rào
  hydraulicWinches?: string;   // Tời thủy lực
  controlSystem?: string;      // Hệ thống điều khiển
  workLights?: string;         // Đèn chiếu sáng
}

// Chi tiết về hệ thống nâng người (xe nâng người làm việc trên cao)
export interface AerialPlatformSpec {
  workingHeight?: string;      // Chiều cao làm việc
  horizontalReach?: string;    // Tầm vươn ngang
  platformCapacity?: string;   // Tải trọng giỏ
  platformSize?: string;       // Kích thước giỏ
  boomElevation?: string;      // Góc nâng boom
  slewing?: string;            // Góc quay
  boomType?: string;           // Loại boom
  insulationRating?: string;   // Điện áp cách điện
  outriggerSpan?: string;      // Khẩu độ chân chống
  controlSystem?: string;      // Hệ thống điều khiển
  safetyFeatures?: string;     // Tính năng an toàn
  // Scissor lift specific fields
  maxPlatformHeight?: string;    // Chiều cao nâng sàn tối đa
  platformExtension?: string;    // Sàn mở rộng
  voltage?: string;              // Điện áp
  batteryCapacity?: string;      // Dung lượng pin
  chargingTime?: string;         // Thời gian sạc
  operatingTime?: string;        // Thời gian hoạt động
  hydraulicSystem?: string;      // Hệ thống thủy lực
  liftingSpeed?: string;         // Tốc độ nâng
  loweringSpeed?: string;        // Tốc độ hạ
  driveSystem?: string;          // Hệ thống dẫn động
  tireType?: string;             // Loại lốp
  travelSpeed?: string;          // Tốc độ di chuyển
  gradability?: string;          // Khả năng leo dốc
  turningRadius?: string;        // Bán kính quay
  operatingTemperature?: string; // Nhiệt độ hoạt động
  noiseLevel?: string;           // Độ ồn
  certifications?: string;       // Chứng nhận
}

// Chi tiết về giá chữ A chở kính (xe chở kính, đá hoa cương)
export interface GlassRackSpecification {
  rackType?: string;              // Loại giá (chữ A, chữ L, etc.)
  rackDimension?: string;         // Kích thước giá
  rackMaterial?: string;          // Vật liệu khung giá
  surfaceFinish?: string;         // Xử lý bề mặt (sơn tĩnh điện, mạ kẽm)
  rackAngle?: string;             // Góc nghiêng giá
  loadCapacityPerSide?: string;   // Tải trọng mỗi bên
  maxGlassSize?: string;          // Kích thước kính tối đa
  paddingMaterial?: string;       // Vật liệu lót đệm
  separatorMaterial?: string;     // Vật liệu ngăn cách giữa các tấm
  strapType?: string;             // Loại dây đai
  strapQuantity?: string;         // Số lượng dây đai
  tieDownPoints?: string;         // Số điểm neo
  crossBracing?: string;          // Thanh giằng chéo
  endStops?: string;              // Thanh chắn đầu/cuối
  certifications?: string;        // Chứng nhận
}

// Chi tiết về giỏ nâng người (man basket) gắn vào cẩu
export interface ManBasketSpecification {
  model?: string;                   // Model giỏ
  size?: string;                    // Kích thước giỏ (DxRxC)
  capacity?: string;                // Tải trọng giỏ
  persons?: string;                 // Số người
  material?: string;                // Vật liệu
  insulationRating?: string;        // Khả năng cách điện
  insulationResistance?: string;    // Điện trở cách điện
  floor?: string;                   // Sàn giỏ
  railing?: string;                 // Lan can
  safetyHook?: string;              // Điểm móc dây an toàn
  weight?: string;                  // Trọng lượng giỏ
  connection?: string;              // Kết nối với cẩu
  toolHolder?: string;              // Giá dụng cụ
  certification?: string;           // Chứng nhận
  color?: string;                   // Màu sắc
}

// Chi tiết về hệ thống hút chân không (xe hút bụi công nghiệp)
export interface VacuumSystemSpec {
  tankCapacity?: string;       // Dung tích bồn
  tankMaterial?: string;       // Vật liệu bồn
  tankDimensions?: string;     // Kích thước bồn
  vacuumLevel?: string;        // Độ chân không
  airFlowRate?: string;        // Lưu lượng khí
  vacuumPump?: string;         // Bơm chân không
  pumpDrive?: string;          // Dẫn động bơm
  blowbackPressure?: string;   // Áp suất đẩy ngược
  suctionDistance?: string;    // Khoảng cách hút
  fillTime?: string;           // Thời gian hút đầy
  filterType?: string;         // Loại lọc
  filterStages?: string;       // Số tầng lọc
  filterArea?: string;         // Diện tích lọc
  filterCleaning?: string;     // Làm sạch lọc
  dischargeDoor?: string;      // Cửa xả
  liftingAngle?: string;       // Góc nâng bồn
  suctionHose?: string;        // Ống hút
  hoseReel?: string;           // Tời cuộn ống
}

// Chi tiết về xe nâng đầu chở máy công trình
export interface TiltDeckSpecification {
  deckLength?: string;            // Chiều dài sàn
  deckWidth?: string;             // Chiều rộng sàn
  deckCapacity?: string;          // Tải trọng sàn
  deckMaterial?: string;          // Vật liệu sàn
  deckFrame?: string;             // Khung sàn
  tiltAngle?: string;             // Góc nâng đầu
  tiltCylinder?: string;          // Xi lanh nâng
  hydraulicPressure?: string;     // Áp suất thủy lực
  hydraulicPump?: string;         // Bơm thủy lực
  rampLength?: string;            // Chiều dài cầu lên
  rampWidth?: string;             // Chiều rộng cầu lên
  rampCapacity?: string;          // Tải trọng cầu lên
  rampAngle?: string;             // Góc nghiêng cầu
  winchCapacity?: string;         // Lực kéo tời
  winchCableSpec?: string;        // Thông số cáp tời
  winchSpeed?: string;            // Tốc độ tời
  winchControl?: string;          // Điều khiển tời
  tieDownPoints?: string;         // Chốt neo cố định
  safetyFeatures?: string;        // Tính năng an toàn
}

// Chi tiết về xe quét rửa đường
export interface StreetSweeperSpecification {
  garbageTankCapacity?: string;     // Dung tích bồn rác
  waterTankCapacity?: string;       // Dung tích bồn nước
  tankMaterial?: string;            // Vật liệu bồn
  mainBrushDiameter?: string;       // Đường kính chổi chính
  sideBrushDiameter?: string;       // Đường kính chổi bên
  sweepingWidth?: string;           // Chiều rộng quét
  brushDrive?: string;              // Dẫn động chổi
  brushPressure?: string;           // Áp lực chổi
  vacuumPumpType?: string;          // Loại bơm hút
  vacuumAirFlow?: string;           // Lưu lượng hút
  vacuumLevel?: string;             // Độ chân không
  suctionNozzleWidth?: string;      // Chiều rộng miệng hút
  filterSystem?: string;            // Hệ thống lọc
  filterCleaning?: string;          // Làm sạch bộ lọc
  dustSprayPressure?: string;       // Áp lực phun dập bụi
  dustSprayFlow?: string;           // Lưu lượng phun dập bụi
  highPressurePump?: string;        // Bơm áp lực cao
  highPressureFlow?: string;        // Lưu lượng bơm cao áp
  sprayGunHoseLength?: string;      // Dây súng phun
  waterPumpType?: string;           // Loại bơm nước
  dumpingSystem?: string;           // Hệ thống xả rác
  sweepingSpeed?: string;           // Tốc độ quét
  sweepingProductivity?: string;    // Năng suất quét
  controlSystem?: string;           // Hệ thống điều khiển
  safetyFeatures?: string;          // Tính năng an toàn
}

// Chi tiết về xe arm roll hook lift
export interface ArmRollSpecification {
  binCapacity?: string;             // Dung tích thùng
  binDimension?: string;            // Kích thước thùng
  binMaterial?: string;             // Vật liệu thùng
  binFloor?: string;                // Đáy thùng
  hookType?: string;                // Loại móc
  armFrame?: string;                // Khung cánh tay
  pivotShaft?: string;              // Trục bản lề
  tailRoller?: string;              // Con lăn đuôi
  liftAngle?: string;               // Góc nâng
  tiltAngle?: string;               // Góc nghiêng (chức năng ben)
  cylinderCount?: string;           // Số xi lanh
  cylinderDimension?: string;       // Kích thước xi lanh
  hydraulicPressure?: string;       // Áp suất thủy lực
  liftingForce?: string;            // Lực nâng
  cylinderOrigin?: string;          // Xuất xứ xi lanh
  hydraulicPump?: string;           // Bơm thủy lực
  oilTankCapacity?: string;         // Dung tích thùng dầu
  oilFilter?: string;               // Lọc dầu
  hydraulicOil?: string;            // Loại dầu thủy lực
  liftingTime?: string;             // Thời gian nâng
  loweringTime?: string;            // Thời gian hạ
  controlSystem?: string;           // Hệ thống điều khiển
  binLock?: string;                 // Khóa thùng
  safetyValve?: string;             // Van an toàn
}

// Chi tiết về xe chữa cháy cứu hỏa
export interface FireFightingSpecification {
  waterTankCapacity?: string;       // Dung tích bồn nước
  waterTankMaterial?: string;       // Vật liệu bồn nước
  foamTankCapacity?: string;        // Dung tích bồn foam
  foamTankMaterial?: string;        // Vật liệu bồn foam
  foamType?: string;                // Loại foam (AFFF/AR-AFFF)
  foamMixingSystem?: string;        // Hệ thống trộn foam
  pumpType?: string;                // Loại bơm
  pumpFlowRate?: string;            // Lưu lượng bơm
  pumpPressure?: string;            // Áp suất bơm
  pumpDrive?: string;               // Dẫn động bơm
  suctionDepth?: string;            // Độ sâu hút
  monitorGun?: string;              // Súng monitor
  monitorRange?: string;            // Tầm phun
  dischargeOutlets?: string;        // Cửa xả
  hosereels?: string;               // Cuộn vòi nhanh
  fireHoseD65?: string;             // Vòi D65
  fireHoseD50?: string;             // Vòi D50
  nozzleTypeA?: string;             // Lăng phun A
  nozzleTypeB?: string;             // Lăng phun B
  foamNozzle?: string;              // Lăng phun bọt
  ladder3Section?: string;          // Thang 3 đoạn
  hookLadder?: string;              // Thang móc
  fireProofSuit?: string;           // Quần áo chống cháy
  scbaSet?: string;                 // Bình thở SCBA
  lightTower?: string;              // Cột đèn
  siren?: string;                   // Còi hú
  warningLights?: string;           // Đèn cảnh báo
  certifications?: string;          // Chứng nhận
}

// Chi tiết về xe bồn chở nhựa đường nóng
export interface BitumenTankSpecification {
  capacity?: string;                // Dung tích
  tankDimension?: string;           // Kích thước bồn
  innerMaterial?: string;           // Vật liệu bồn trong
  insulationMaterial?: string;      // Vật liệu bảo ôn
  outerShell?: string;              // Vỏ bọc ngoài
  workingTemperature?: string;      // Nhiệt độ làm việc
  heatRetention?: string;           // Khả năng giữ nhiệt
  heatingType?: string;             // Loại gia nhiệt
  burnerType?: string;              // Loại lò đốt
  burnerPower?: string;             // Công suất lò đốt
  heatTransferOil?: string;         // Dầu tải nhiệt
  heatingCoil?: string;             // Ống xoắn gia nhiệt
  bitumenPumpType?: string;         // Loại bơm nhựa
  pumpFlowRate?: string;            // Lưu lượng bơm
  pumpPressure?: string;            // Áp suất bơm
  sprayBarWidth?: string;           // Chiều rộng giàn phun
  nozzleCount?: string;             // Số vòi phun
  nozzleControl?: string;           // Điều khiển vòi
  sprayDensity?: string;            // Mật độ phun
  handSprayGun?: string;            // Súng phun tay
  displaySystem?: string;           // Hệ thống hiển thị
  safetySystem?: string;            // Hệ thống an toàn
  certifications?: string;          // Chứng nhận
}

// Chi tiết về máy xúc đào
export interface ExcavatorSpecification {
  operatingWeight?: string;         // Trọng lượng vận hành
  bucketCapacity?: string;          // Dung tích gầu
  maxDigDepth?: string;             // Chiều sâu đào tối đa
  maxReach?: string;                // Tầm với tối đa
  maxDigHeight?: string;            // Chiều cao đào tối đa
  maxDumpHeight?: string;           // Chiều cao xả tối đa
  bucketDiggingForce?: string;      // Lực đào gầu
  armDiggingForce?: string;         // Lực đào tay cần
  swingSpeed?: string;              // Tốc độ quay toa
  boomLength?: string;              // Chiều dài cần
  armLength?: string;               // Chiều dài tay cần
  trackShoeWidth?: string;          // Chiều rộng xích
  travelSpeed?: string;             // Tốc độ di chuyển
  groundPressure?: string;          // Áp suất mặt đất
  fuelTankCapacity?: string;        // Dung tích bình nhiên liệu
  hydraulicFlowRate?: string;       // Lưu lượng thủy lực
  hydraulicPressure?: string;       // Áp suất thủy lực
  workModes?: string;               // Chế độ làm việc
  cabinType?: string;               // Loại cabin
  attachments?: string;             // Phụ kiện
  certifications?: string;          // Chứng nhận
}

export interface ForkliftSpecification {
  liftCapacity?: string;            // Tải trọng nâng
  maxLiftHeight?: string;           // Chiều cao nâng tối đa
  freeLift?: string;                // Chiều cao tự do
  forkLength?: string;              // Chiều dài càng
  mastType?: string;                // Loại khung nâng
  tiltAngle?: string;               // Góc nghiêng
  liftSpeedLoaded?: string;         // Tốc độ nâng có tải
  travelSpeedLoaded?: string;       // Tốc độ di chuyển có tải
  gradability?: string;             // Khả năng leo dốc
  turningRadius?: string;           // Bán kính quay
  aisleWidth?: string;              // Chiều rộng lối đi
  fuelConsumption?: string;         // Tiêu hao nhiên liệu
  counterweight?: string;           // Đối trọng
  safetySystem?: string;            // Hệ thống an toàn
  attachments?: string;             // Phụ kiện
  certifications?: string;          // Chứng nhận
  // Additional fields from JSON
  loadCapacity?: string;
  loadCenter?: string;
  liftHeight?: string;
  forkDimensions?: string;
  freeLifHeight?: string;
  motorType?: string;
  batterySpec?: string;
  transmission?: string;
  steeringType?: string;
  tireType?: string;
}

// Thông số máy ủi
export interface BulldozerSpecification {
  bladeType?: string;               // Loại lưỡi ủi
  bladeCapacity?: string;           // Dung tích lưỡi
  bladeWidth?: string;              // Chiều rộng lưỡi
  bladeHeight?: string;             // Chiều cao lưỡi
  maxBladeRaise?: string;           // Chiều cao nâng lưỡi tối đa
  maxBladeDig?: string;             // Độ cắm lưỡi tối đa
  bladeTiltAngle?: string;          // Góc nghiêng lưỡi
  drawbarPull?: string;             // Lực kéo thanh
  trackLength?: string;             // Chiều dài xích
  trackShoeWidth?: string;          // Chiều rộng guốc xích
  trackGauge?: string;              // Khoảng cách xích
  groundPressure?: string;          // Áp suất lên mặt đất
  numberOfRollers?: string;         // Số con lăn
  ripperType?: string;              // Loại ripper
  hydraulicSystem?: string;         // Hệ thống thủy lực
}

// Thông số máy san
export interface GraderSpecification {
  bladeWidth?: string;              // Chiều rộng lưỡi san
  bladeHeight?: string;             // Chiều cao lưỡi san
  bladeThickness?: string;          // Độ dày lưỡi
  maxBladeRaise?: string;           // Nâng lưỡi tối đa
  maxBladeDig?: string;             // Cắm lưỡi tối đa
  circleRotation?: string;          // Góc quay đĩa
  bladeTiltAngle?: string;          // Góc nghiêng lưỡi
  bladeSideshift?: string;          // Dịch ngang lưỡi
  articulationAngle?: string;       // Góc khớp nối
  leanAngle?: string;               // Góc nghiêng bánh trước
  scarifierWidth?: string;          // Chiều rộng scarifier
  scarifierDepth?: string;          // Độ sâu scarifier
  frontWheelLean?: string;          // Góc nghiêng bánh trước
  turningRadius?: string;           // Bán kính quay
  groundClearance?: string;         // Khoảng sáng gầm
}

// Thông số máy xúc lật
export interface LoaderSpecification {
  bucketCapacity?: string;          // Dung tích gầu
  bucketWidth?: string;             // Chiều rộng gầu
  breakoutForce?: string;           // Lực xúc
  staticTippingLoad?: string;       // Tải trọng lật tĩnh
  maxLiftHeight?: string;           // Chiều cao nâng tối đa
  dumpHeight?: string;              // Chiều cao đổ
  dumpReach?: string;               // Tầm đổ
  digDepth?: string;                // Độ sâu đào
  rackbackAngle?: string;           // Góc ngửa gầu
  dumpAngle?: string;               // Góc đổ
  liftCycleTime?: string;           // Thời gian nâng
  dumpCycleTime?: string;           // Thời gian đổ
  lowerCycleTime?: string;          // Thời gian hạ
  hydraulicPumpFlow?: string;       // Lưu lượng bơm thủy lực
  hydraulicPressure?: string;       // Áp suất thủy lực
  turningRadius?: string;           // Bán kính quay
}

// Thông số xe lu
export interface RollerSpecification {
  drumWidth?: string;               // Chiều rộng trống
  drumDiameter?: string;            // Đường kính trống
  drumWeight?: string;              // Trọng lượng trống
  centrifugalForce?: string;        // Lực li tâm
  frequency?: string;               // Tần số rung
  amplitude?: string;               // Biên độ rung
  staticLinearLoad?: string;        // Tải trọng tuyến tính
  compactionDepth?: string;         // Độ sâu đầm nén
  compactionWidth?: string;         // Chiều rộng đầm nén
  vibrationMode?: string;           // Chế độ rung
  rearTireSize?: string;            // Kích thước lốp sau
  rearAxleWeight?: string;          // Tải trọng cầu sau
  steeringAngle?: string;           // Góc lái
  climbingAbility?: string;         // Khả năng leo dốc
  turningRadius?: string;           // Bán kính quay
  waterTankCapacity?: string;       // Dung tích bình nước
  // For pneumatic rollers
  numberOfWheels?: string;          // Số lượng bánh
  tireSize?: string;                // Kích thước lốp
  tirePressureRange?: string;       // Dải áp suất lốp
  minWeight?: string;               // Trọng lượng tối thiểu
  maxWeight?: string;               // Trọng lượng tối đa
  ballastType?: string;             // Loại ballast
  waterSpraySystem?: string;        // Hệ thống phun nước
}

// Thông số máy đầm
export interface CompactorSpecification {
  compactorType?: string;           // Loại máy đầm
  plateSize?: string;               // Kích thước bàn đầm
  impactForce?: string;             // Lực đầm
  frequency?: string;               // Tần số đầm
  jumpingHeight?: string;           // Chiều cao nhảy
  compactionDepth?: string;         // Độ sâu đầm nén
  travelSpeed?: string;             // Tốc độ di chuyển
  liftingHandle?: string;           // Tay cầm nâng
  shockMount?: string;              // Đệm chống rung
  throttleControl?: string;         // Điều khiển ga
  airFilter?: string;               // Bộ lọc gió
  oilCapacity?: string;             // Dung tích dầu
  suitableSoil?: string;            // Loại đất phù hợp
}

// Thông số máy phát điện
export interface GeneratorSpecification {
  standbyPower?: string;            // Công suất dự phòng
  primePower?: string;              // Công suất liên tục
  ratedVoltage?: string;            // Điện áp định mức
  frequency?: string;               // Tần số
  phases?: string;                  // Số pha
  powerFactor?: string;             // Hệ số công suất
  alternatorModel?: string;         // Model đầu phát
  alternatorType?: string;          // Loại đầu phát
  excitationType?: string;          // Loại kích từ
  regulationVoltage?: string;       // Điều chỉnh điện áp
  engineSpeed?: string;             // Tốc độ động cơ
  fuelConsumption100?: string;      // Tiêu hao @ 100%
  fuelConsumption75?: string;       // Tiêu hao @ 75%
  fuelConsumption50?: string;       // Tiêu hao @ 50%
  startingSystem?: string;          // Hệ thống khởi động
  coolingSystem?: string;           // Hệ thống làm mát
  controlPanel?: string;            // Bảng điều khiển
  noiseLevel?: string;              // Độ ồn
  atsCompatible?: string;           // Tương thích ATS
  protectionClass?: string;         // Cấp bảo vệ
}

// Thông số máy nén khí
export interface CompressorSpecification {
  compressorType?: string;          // Loại máy nén
  freeAirDelivery?: string;         // Lưu lượng khí
  normalPressure?: string;          // Áp suất làm việc
  maxPressure?: string;             // Áp suất tối đa
  airOutletSize?: string;           // Kích thước cổng ra
  airReceiverVolume?: string;       // Dung tích bình khí
  oilCapacity?: string;             // Dung tích dầu
  oilType?: string;                 // Loại dầu
  coolingSystem?: string;           // Hệ thống làm mát
  fuelConsumption100?: string;      // Tiêu hao @ 100%
  fuelConsumption75?: string;       // Tiêu hao @ 75%
  runTimeAtFullTank?: string;       // Thời gian chạy
  noiseLevel?: string;              // Độ ồn
  trailerType?: string;             // Loại moóc
  towingSpeed?: string;             // Tốc độ kéo
  airFilter?: string;               // Bộ lọc gió
  safetyFeatures?: string;          // Tính năng an toàn
  operatingTemperature?: string;    // Nhiệt độ hoạt động
}

// Thông số máy trộn bê tông tự hành
export interface ConcreteMixerSpecification {
  mixerCapacity?: string;             // Dung tích thùng trộn
  outputPerBatch?: string;            // Sản lượng mỗi mẻ
  bucketCapacity?: string;            // Dung tích gầu xúc
  waterTankCapacity?: string;         // Dung tích bồn nước
  mixingTime?: string;                // Thời gian trộn
  drumSpeed?: string;                 // Tốc độ quay thùng
  maxDischargingHeight?: string;      // Chiều cao đổ tối đa
  maxTransportSpeed?: string;         // Tốc độ di chuyển
  gradability?: string;               // Khả năng leo dốc
  wheelDrive?: string;                // Hệ thống dẫn động
  weighingSystem?: string;            // Hệ thống cân
  hydraulicSystem?: string;           // Hệ thống thủy lực
  steeringType?: string;              // Loại lái
  turningRadius?: string;             // Bán kính quay
}

// Thông số trạm trộn bê tông
export interface BatchingPlantSpecification {
  theoreticalOutput?: string;         // Công suất lý thuyết
  mixerType?: string;                 // Loại máy trộn
  mixerCapacity?: string;             // Dung tích máy trộn
  aggregateBins?: string;             // Số phễu cốt liệu
  aggregateBinCapacity?: string;      // Dung tích mỗi phễu
  cementSiloCapacity?: string;        // Dung tích silo xi măng
  conveyorWidth?: string;             // Chiều rộng băng tải
  conveyorSpeed?: string;             // Tốc độ băng tải
  weighingSystem?: string;            // Hệ thống cân
  weighingAccuracy?: string;          // Độ chính xác cân
  controlSystem?: string;             // Hệ thống điều khiển
  waterMeasuring?: string;            // Hệ thống đo nước
  admixtureMeasuring?: string;        // Hệ thống đo phụ gia
  dustCollector?: string;             // Hệ thống lọc bụi
  installTime?: string;               // Thời gian lắp đặt
  totalPower?: string;                // Tổng công suất điện
}

// Thông số máy bơm bê tông
export interface ConcretePumpSpecification {
  theoreticalOutput?: string;         // Công suất lý thuyết
  maxPressure?: string;               // Áp suất tối đa
  cylinderDiameter?: string;          // Đường kính xi lanh
  pistonStroke?: string;              // Hành trình piston
  strokesPerMinute?: string;          // Số hành trình/phút
  hopperCapacity?: string;            // Dung tích phễu
  maxAggregateSize?: string;          // Kích thước cốt liệu tối đa
  pipelineDiameter?: string;          // Đường kính ống bơm
  horizontalDistance?: string;        // Cự ly bơm ngang
  verticalDistance?: string;          // Cự ly bơm đứng
  hydraulicPressure?: string;         // Áp suất thủy lực
  hydraulicOilCapacity?: string;      // Dung tích dầu thủy lực
  remoteControl?: string;             // Điều khiển từ xa
  cleaningSystem?: string;            // Hệ thống làm sạch
  trailerType?: string;               // Loại moóc
}

// Thông số palang điện cầu trục
export interface HoistSpecification {
  liftCapacity?: string;              // Tải trọng nâng
  liftHeight?: string;                // Chiều cao nâng
  liftSpeed?: string;                 // Tốc độ nâng
  liftMotorPower?: string;            // Công suất động cơ nâng
  hoistType?: string;                 // Loại palang (dây xích/cáp)
  chainType?: string;                 // Loại xích/cáp
  brakeType?: string;                 // Loại phanh
  dutyClass?: string;                 // Cấp chế độ làm việc
  voltage?: string;                   // Điện áp
  frequency?: string;                 // Tần số
  protectionClass?: string;           // Cấp bảo vệ
  ambientTemperature?: string;        // Nhiệt độ môi trường
  trolleySpeed?: string;              // Tốc độ xe con
  trolleyMotorPower?: string;         // Công suất động cơ xe con
  craneSpan?: string;                 // Khẩu độ cầu trục
  controlType?: string;               // Loại điều khiển
  safetyFeatures?: string;            // Tính năng an toàn
}

export interface Truck {
  id: string;
  name: string;
  slug: string;
  brand: string | string[];
  price?: number | null;
  priceText?: string;
  weightText: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  dimensions: string;
  type: VehicleType;
  secondaryType?: VehicleType; // Secondary category for products appearing in multiple listings
  isNew?: boolean;
  isHot?: boolean;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'pre-order' | 'discontinued';
  rating?: number;        // Đánh giá sao (1-5), mặc định 5
  reviewCount?: number;   // Số lượng đánh giá, mặc định 312
  origin?: string;
  thumbnailUrl: string;
  images: string[];

  // Thông số kỹ thuật cơ bản
  specifications?: Record<string, any>;

  // Mô tả và tính năng
  description?: string;
  detailedDescription?: string;  // Thêm thuộc tính này để lưu mô tả chi tiết riêng cho từng sản phẩm
  features?: string[];

  // Media
  videoUrl?: string;  // YouTube video URL for Video Schema and player

  // Thông số chi tiết cho động cơ
  engineModel?: string;       // Model động cơ
  engineCapacity?: string;    // Dung tích động cơ
  enginePower?: string;       // Công suất động cơ
  engineTorque?: string;      // Mô-men xoắn
  emissionStandard?: string;  // Tiêu chuẩn khí thải

  // Chi tiết chuyên biệt theo loại xe
  boxType?: 'đông-lạnh' | 'bảo-ôn' | 'kín' | 'bạt' | 'lửng' | 'xi-téc' | 'chuyên-dùng';
  craneType?: 'cẩu-rời' | 'cẩu-gắn-xe';
  trailerType?: 'ben' | 'sàn' | 'sàn-rút' | 'lùn' | 'cổ-cò' | 'xương' | 'lửng' | 'rào' | 'xi-téc' | 'bồn-xi-măng' | 'bồn-sắt' | 'bồn-bột-mì';

  // Thông số kỹ thuật chi tiết theo loại xe
  coolingBox?: CoolingBoxStructure;
  insulatedBox?: InsulatedBoxStructure;
  closedBox?: ClosedBoxStructure;
  tarpaulinBox?: TarpaulinBoxStructure;
  flatbedBox?: FlatbedStructure;
  tankSpec?: TankSpecification;
  craneSpec?: CraneSpecification;
  trailerSpec?: TrailerSpecification;
  tractorSpec?: TractorSpecification;

  // Thông số kỹ thuật chuyên dụng (specialized equipment)
  drillingSystem?: DrillingSystemSpec;      // Máy khoan cọc nhồi
  ladderSystem?: LadderSystemSpec;          // Xe thang cứu hộ
  wireDispenserId?: WireDispenserSpec;      // Xe rải dây thép gai
  aerialPlatformSpec?: AerialPlatformSpec;  // Xe nâng người trên cao
  vacuumSystem?: VacuumSystemSpec;          // Xe hút bụi công nghiệp
  glassRackSpec?: GlassRackSpecification;   // Xe chở kính giá chữ A
  manBasketSpec?: ManBasketSpecification;   // Giỏ nâng người gắn cẩu
  tiltDeckSpec?: TiltDeckSpecification;     // Xe nâng đầu chở máy công trình
  streetSweeperSpec?: StreetSweeperSpecification; // Xe quét rửa đường
  armRollSpec?: ArmRollSpecification;   // Xe arm roll hook lift
  fireFightingSpec?: FireFightingSpecification; // Xe chữa cháy cứu hỏa
  bitumenTankSpec?: BitumenTankSpecification; // Xe bồn chở nhựa đường nóng
  excavatorSpec?: ExcavatorSpecification; // Máy xúc đào
  forkliftSpec?: ForkliftSpecification; // Xe nâng hàng
  bulldozerSpec?: BulldozerSpecification; // Máy ủi
  graderSpec?: GraderSpecification; // Máy san nền
  loaderSpec?: LoaderSpecification; // Máy xúc lật
  rollerSpec?: RollerSpecification; // Xe lu
  compactorSpec?: CompactorSpecification; // Máy đầm
  generatorSpec?: GeneratorSpecification; // Máy phát điện
  compressorSpec?: CompressorSpecification; // Máy nén khí
  concreteMixerSpec?: ConcreteMixerSpecification; // Máy trộn bê tông tự hành
  batchingPlantSpec?: BatchingPlantSpecification; // Trạm trộn bê tông
  concretePumpSpec?: ConcretePumpSpecification; // Máy bơm bê tông tĩnh
  hoistSpec?: HoistSpecification; // Palang điện cầu trục

  // Thông số kỹ thuật phổ biến
  engineType?: string;
  fuel?: string;
  transmission?: string;
  wheelbase?: number;
  wheelbaseText?: string;
  tires?: string;
  brakeSystem?: string;
  cabinType?: string;
  seats?: number;
  steeringSystem?: string;
  suspensionType?: string;

  // Thông số khung gầm
  chassisMaterial?: string;  // Vật liệu khung gầm
  frontSuspension?: string;  // Hệ thống treo trước
  rearSuspension?: string;   // Hệ thống treo sau
  frontBrake?: string;       // Phanh trước
  rearBrake?: string;        // Phanh sau
  parkingBrake?: string;     // Phanh tay/phanh đỗ
  steeringType?: string;     // Loại hệ thống lái

  // Kích thước
  insideDimension?: string;  // Kích thước thùng bên trong (DxRxC)
  groundClearance?: number;  // Khoảng sáng gầm xe (mm)
  wheelTrack?: string;       // Vết bánh xe (trước/sau) (mm)
  turningRadius?: number;    // Bán kính quay vòng (m)

  // Trọng lượng chi tiết
  grossWeight?: string;      // Tổng tải trọng
  kerbWeight?: string;       // Trọng lượng không tải
  frontAxleLoad?: string;    // Tải trọng cầu trước
  rearAxleLoad?: string;     // Tải trọng cầu sau

  // Thông số hiệu suất
  maxSpeed?: string;         // Tốc độ tối đa
  climbingAbility?: string;  // Khả năng leo dốc
  fuelConsumption?: string;  // Mức tiêu thụ nhiên liệu

  // Trang bị tiện nghi
  cabinFeatures?: string[];  // Tính năng cabin

  // Cho phép mở rộng thêm các trường khác
  [key: string]: any;
}

// ... keep existing code (utility functions getVehicleUrlPrefix, getVehicleTypeName, getBoxTypeName, getTrailerTypeName)
export function getVehicleUrlPrefix(type: VehicleType): string {
  // Trả về chính mã loại xe làm prefix URL để tự động hỗ trợ danh mục mới
  return String(type || '').trim();
}

export function getVehicleTypeName(type: VehicleType): string {
  switch (type) {
    case 'xe-tai':
      return 'Xe Tải';
    case 'xe-cau':
      return 'Xe Cẩu';
    case 'mooc':
      return 'Sơ Mi Rơ Mooc';
    case 'dau-keo':
      return 'Xe Đầu Kéo';
    case 'xe-lu':
      return 'Xe Lu';
    case 'xe-nang-nguoi':
      return 'Xe Nâng Người';
    case 'xe-nang':
      return 'Xe Nâng';
    case 'may-moc-thiet-bi':
      return 'Máy Móc & Thiết Bị';
  }
  const pretty = String(type || '')
    .split('-')
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(' ');
  return pretty || '';
}


export function getBoxTypeName(type?: string): string {
  if (!type) return '';
  // First try from generated data, fallback to switch case
  const fromGenerated = getBoxTypeNameFromGenerated(type);
  if (fromGenerated) return fromGenerated;

  // Fallback for any types not yet in box-types.json
  switch (type) {
    case 'đông-lạnh':
      return 'Thùng Đông Lạnh';
    case 'bảo-ôn':
      return 'Thùng Bảo Ôn';
    case 'kín':
      return 'Thùng Kín';
    case 'bạt':
      return 'Thùng Bạt';
    case 'lửng':
      return 'Thùng Lửng';
    case 'bồn-xi-téc':
      return 'Xe Bồn Xi Téc';
    case 'cánh-dơi':
      return 'Thùng Cánh Dơi';
    case 'ben':
      return 'Xe Ben (Xe Tự Đổ)';
    case 'trộn-bê-tông':
      return 'Xe Trộn Bê Tông';
    case 'bơm-bê-tông':
      return 'Xe Bơm Bê Tông';
    case 'chở-gia-súc':
      return 'Thùng Chở Gia Súc';
    case 'chuyên-dùng':
      return 'Xe Chuyên Dùng';
    case 'xe-tải-gắn-cẩu':
      return 'Xe Tải Gắn Cẩu';
    case 'máy-xúc-đào':
      return 'Máy Xúc Đào';
    default:
      return '';
  }
}

export function getTrailerTypeName(type?: string): string {
  if (!type) return '';
  // First try from generated data, fallback to switch case
  const fromGenerated = getTrailerTypeNameFromGenerated(type);
  if (fromGenerated) return fromGenerated;

  // Fallback for any types not yet in box-types.json
  switch (type) {
    case 'ben':
      return 'Mooc Ben';
    case 'sàn':
      return 'Mooc Sàn';
    case 'sàn-rút':
      return 'Mooc Sàn Rút Dài';
    case 'lùn':
      return 'Mooc Lùn';
    case 'cổ-cò':
      return 'Mooc Cổ Cò';
    case 'xương':
      return 'Mooc Xương';
    case 'lửng':
      return 'Mooc Lửng';
    case 'lồng':
      return 'Mooc Lồng';
    case 'rào':
      return 'Mooc Rào';
    case 'xi-téc':
      return 'Mooc Xi Téc';
    case 'bồn-xi-măng':
      return 'Mooc Bồn Chở Xi Măng Rời';
    case 'bồn-sắt':
      return 'Mooc Bồn Chở Bụi Sắt';
    case 'bồn-bột-mì':
      return 'Mooc Bồn Chở Bột Mì';
    case 'đông-lạnh':
      return 'Mooc Đông Lạnh';
    case 'hút-chất-thải':
      return 'Mooc Hút Chất Thải';
    case 'bồn-nh3':
      return 'Mooc Bồn Chở NH3 Lỏng';
    case 'bồn-ni-tơ':
      return 'Mooc Bồn Chở Ni Tơ Lỏng';
    case 'bồn-hóa-chất':
      return 'Mooc Bồn Chở Hóa Chất';
    case 'bồn-bột-pvc':
      return 'Mooc Bồn Chở Bột Nhựa PVC';
    case 'bồn-nhựa-đường':
      return 'Mooc Bồn Chở Nhựa Đường';
    case 'bồn-thức-ăn':
      return 'Mooc Bồn Chở Thức Ăn Chăn Nuôi';
    case 'bồn-lpg':
      return 'Mooc Bồn Chở Khí LPG';
    case 'bồn-methanol':
      return 'Mooc Bồn Chở Methanol';
    case 'bồn-hạt-nhựa':
      return 'Mooc Bồn Chở Hạt Nhựa';
    case 'bồn-co2':
      return 'Mooc Bồn Chở CO2 Lỏng';
    case 'bồn-ethylene-glycol':
      return 'Mooc Bồn Chở Ethylene Glycol';
    default:
      return '';
  }
}

// Get stock status display info for UI
export function getStockStatusInfo(status?: string): { label: string; className: string; show: boolean } {
  switch (status) {
    case 'out-of-stock':
      return {
        label: 'Hết hàng',
        className: 'bg-gray-500 hover:bg-gray-600 text-white',
        show: true
      };
    case 'pre-order':
      return {
        label: 'Đặt trước',
        className: 'bg-amber-500 hover:bg-amber-600 text-white',
        show: true
      };
    case 'discontinued':
      return {
        label: 'Ngừng KD',
        className: 'bg-red-800 hover:bg-red-900 text-white',
        show: true
      };
    case 'in-stock':
    default:
      return {
        label: 'Sẵn hàng',
        className: 'bg-green-500 hover:bg-green-600 text-white',
        show: true // Hiển thị badge sẵn hàng để thu hút khách hàng
      };
  }
}

