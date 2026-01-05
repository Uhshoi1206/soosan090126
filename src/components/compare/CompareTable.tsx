
import React, { useMemo } from 'react';
import { Truck } from '@/models/TruckTypes';
import { getCategoryName, getBoxTypeName, getTrailerTypeName } from '@/lib/generated/categories';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/contexts/CompareContextAstro';
import { X, Trash2 } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface CompareTableProps {
  trucks: Truck[];
}

// Label mappings cho các field phổ biến
const labelMappings: Record<string, string> = {
  // Basic info
  brand: 'Thương hiệu',
  model: 'Model',
  name: 'Tên sản phẩm',
  weightText: 'Tải trọng',
  dimensions: 'Kích thước tổng thể',
  price: 'Giá bán',
  priceText: 'Giá bán',
  origin: 'Xuất xứ',
  tires: 'Lốp xe',
  seats: 'Số chỗ ngồi',
  warranty: 'Bảo hành',
  fuel: 'Nhiên liệu',
  wheelbaseText: 'Chiều dài cơ sở',
  stockStatus: 'Tình trạng kho',
  craneType: 'Loại cẩu',

  // Dimensions
  length: 'Chiều dài',
  width: 'Chiều rộng',
  height: 'Chiều cao',
  wheelbase: 'Chiều dài cơ sở',
  groundClearance: 'Khoảng sáng gầm',
  turningRadius: 'Bán kính quay vòng',
  insideDimension: 'Kích thước thùng trong',
  overallDimensions: 'Kích thước tổng thể',
  containerDimensions: 'Kích thước thùng hàng',
  capacity: 'Dung tích/Thể tích',
  overallLength: 'Chiều dài tổng thể',
  overallWidth: 'Chiều rộng tổng thể',
  overallHeight: 'Chiều cao tổng thể',
  aisleWidth: 'Chiều rộng lối đi',
  internalDimensions: 'Kích thước trong',
  externalDimensions: 'Kích thước ngoài',

  // Weight
  weight: 'Trọng lượng',
  grossWeight: 'Tổng tải',
  kerbWeight: 'Trọng lượng không tải',
  curbWeight: 'Khối lượng bản thân',
  payload: 'Tải trọng cho phép',
  frontAxleLoad: 'Tải trọng cầu trước',
  rearAxleLoad: 'Tải trọng cầu sau',
  counterweight: 'Đối trọng',
  operatingWeight: 'Trọng lượng vận hành',
  totalWeight: 'Tổng trọng lượng',
  netWeight: 'Trọng lượng tịnh',

  // Engine
  engineType: 'Loại động cơ',
  engineModel: 'Model động cơ',
  engineCapacity: 'Dung tích động cơ',
  enginePower: 'Công suất',
  engineTorque: 'Mô-men xoắn',
  transmission: 'Hộp số',
  transmissionType: 'Loại hộp số',
  fuelConsumption: 'Mức tiêu thụ nhiên liệu',
  emissionStandard: 'Tiêu chuẩn khí thải',
  horsepower: 'Công suất',
  horsepowerRange: 'Phạm vi công suất',
  torque: 'Mô-men xoắn',
  boreStroke: 'Đường kính x Hành trình xi lanh',
  compressionRatio: 'Tỷ số nén',
  firingOrder: 'Thứ tự nổ',
  valveTrain: 'Cơ cấu phân phối khí',
  fuelInjection: 'Hệ thống phun nhiên liệu',
  turbocharger: 'Tăng áp',
  oilCapacity: 'Dung tích nhớt',
  pistonCooling: 'Làm mát piston',
  gearRatioRange: 'Phạm vi tỷ số truyền',
  clutch: 'Ly hợp',
  displacement: 'Dung tích xi lanh',
  coolingSystem: 'Hệ thống làm mát',
  coolingType: 'Loại làm mát',
  bore: 'Đường kính xi lanh',
  stroke: 'Hành trình piston',
  cylinders: 'Số xi lanh',
  aspirationType: 'Kiểu nạp khí',
  fuelType: 'Loại nhiên liệu',

  // Chassis
  chassisMaterial: 'Vật liệu khung gầm',
  frameMaterial: 'Vật liệu khung',
  frameSpec: 'Thông số khung',
  mainBeam: 'Dầm chính',
  frontSuspension: 'Hệ thống treo trước',
  rearSuspension: 'Hệ thống treo sau',
  suspensionType: 'Loại hệ thống treo',
  frontBrake: 'Phanh trước',
  rearBrake: 'Phanh sau',
  parkingBrake: 'Phanh đỗ',
  brakeSystem: 'Hệ thống phanh',
  brakeType: 'Loại phanh',
  steeringType: 'Hệ thống lái',
  steeringSystem: 'Hệ thống lái',
  chassis: 'Khung gầm',

  // Axle
  axleCount: 'Số trục',
  axleType: 'Loại trục',
  axleWeight: 'Tải trọng trục',
  axleRatio: 'Tỷ số truyền cầu',
  frontAxle: 'Cầu trước',
  rearAxle: 'Cầu sau',
  springType: 'Loại nhíp',
  springDimension: 'Kích thước nhíp',
  tireSpec: 'Thông số lốp',
  axleConfiguration: 'Cấu hình trục',
  differentialLock: 'Khóa vi sai',
  trackWidth: 'Vết bánh xe',
  frontTires: 'Lốp trước',
  rearTires: 'Lốp sau',
  axleAndSuspension: 'Trục và hệ thống treo',

  // Landing gear & Kingpin
  landingGear: 'Chân chống',
  kingpin: 'Đinh kéo',
  kingpinLoad: 'Tải trọng chân chốt',

  // Systems
  electricSystem: 'Hệ thống điện',
  hydraulicSystem: 'Hệ thống thủy lực',
  alternator: 'Máy phát điện',
  systems: 'Hệ thống',
  body: 'Thân xe/Thùng',
  finishing: 'Hoàn thiện',

  // Body/Box
  floorMaterial: 'Vật liệu sàn',
  sideWallMaterial: 'Vật liệu thành bên',
  floorType: 'Loại sàn',
  floorThickness: 'Độ dày sàn',
  sideHeight: 'Chiều cao thành bên',

  // Specifications - Truck specific
  wadingDepth: 'Khả năng lội nước',
  airIntakePosition: 'Vị trí cổ hút gió',

  // Finishing
  paintProcess: 'Quy trình sơn',
  paintColor: 'Màu sơn',

  // Crane specs - Basic
  liftingCapacity: 'Sức nâng',
  liftingCapacityText: 'Sức nâng',
  reachLength: 'Tầm với',
  rotationAngle: 'Góc quay',
  stabilizers: 'Chân chống',
  controlSystem: 'Hệ thống điều khiển',
  boomSections: 'Số đốt cần',
  operatingPressure: 'Áp suất vận hành',
  mountingType: 'Kiểu gắn cẩu',
  cabinPresent: 'Cabin điều khiển',
  remoteControl: 'Điều khiển từ xa',
  maxWorkingHeight: 'Chiều cao làm việc tối đa',
  winchCapacity: 'Sức nâng tời',
  maxLiftingMoment: 'Mô-men nâng tối đa',
  maxLiftingHeight: 'Chiều cao nâng tối đa',
  maxWorkingRadius: 'Bán kính làm việc tối đa',
  minWorkingRadius: 'Bán kính làm việc tối thiểu',
  craneModelName: 'Model cẩu',
  craneBrand: 'Thương hiệu cẩu',
  maxHeightBelowGround: 'Chiều cao dưới mặt đất',
  slewingAngle: 'Góc xoay',
  slewingSpeed: 'Tốc độ xoay',
  slewingTorque: 'Mô-men xoay',
  applicableTruckChassis: 'Khung xe phù hợp',

  // Crane Weight - IMPORTANT
  // STD = phiên bản tiêu chuẩn = bản thường (không ghế làm việc trên cao)
  // TopSeat = phiên bản có ghế làm việc trên cao
  craneOperatingWeight: 'Khối lượng bản thân cẩu',
  craneOperatingWeightSTD: 'Khối lượng bản thân cẩu',  // STD = bản thường, gộp với craneOperatingWeight
  craneOperatingWeightTopSeat: 'Khối lượng bản thân cẩu (có ghế làm việc)',
  craneNetWeight: 'Trọng lượng tịnh cẩu',
  craneNetWeightSTD: 'Trọng lượng tịnh cẩu',  // STD = bản thường, gộp với craneNetWeight
  craneNetWeightTopSeat: 'Trọng lượng tịnh cẩu (có ghế làm việc)',
  craneWeight: 'Trọng lượng cẩu',

  // Crane - Boom specs
  boomType: 'Loại cần',
  boomLength: 'Chiều dài cần',
  boomMinLength: 'Chiều dài cần tối thiểu',
  boomMaxLength: 'Chiều dài cần tối đa',
  boomRetractedLength: 'Chiều dài cần thu gọn',
  boomExtendedLength: 'Chiều dài cần duỗi ra',
  boomExtensionSpeed: 'Tốc độ duỗi cần',
  boomExtensionTime: 'Thời gian duỗi cần',
  boomRetractionTime: 'Thời gian thu cần',
  boomLuffingAngle: 'Góc nâng cần',
  boomLuffingSpeed: 'Tốc độ nâng/hạ cần',
  boomLiftingAngle: 'Góc nâng cần',
  boomLiftingTime: 'Thời gian nâng cần',
  boomLoweringTime: 'Thời gian hạ cần',
  jibBoom: 'Cần phụ (Jib)',

  // Crane - Hydraulic system
  hydraulicOilTankCapacity: 'Dung tích bình dầu thủy lực',
  hydraulicTankCapacity: 'Dung tích bình thủy lực',
  hydraulicPumpOutput: 'Công suất bơm thủy lực',
  hydraulicPumpType: 'Loại bơm thủy lực',
  hydraulicPump: 'Bơm thủy lực',
  hydraulicMotor: 'Mô tơ thủy lực',
  hydraulicPressure: 'Áp suất thủy lực',
  hydraulicOperatingPressure: 'Áp suất vận hành thủy lực',
  maxHydraulicPressure: 'Áp suất thủy lực tối đa',
  hydraulicOilFlow: 'Lưu lượng dầu thủy lực',
  hydraulicRatedRevolution: 'Vòng quay định mức thủy lực',
  hydraulicControlValve: 'Van điều khiển thủy lực',
  hydraulicReliefValvePressure: 'Áp suất van xả thủy lực',
  hydraulicCounterBalanceValve: 'Van cân bằng thủy lực',
  hydraulicPilotCheckValve: 'Van kiểm tra pilot thủy lực',
  hydraulicMotorHoisting: 'Mô tơ thủy lực nâng',
  hydraulicMotorSlewing: 'Mô tơ thủy lực xoay',
  hydraulicCylinders: 'Xi lanh thủy lực',
  hydraulicCylinder: 'Xi-lanh thủy lực',
  hydraulicOilCapacity: 'Dung tích dầu thủy lực',

  // Crane - Outrigger/Stabilizer specs
  outriggers: 'Chân chống',
  outriggersType: 'Loại chân chống',
  outriggersVerticalJacks: 'Xi lanh chân chống dọc',
  outriggersHorizontalBeamsFront: 'Dầm ngang chân chống trước',
  outriggersHorizontalBeamsRear: 'Dầm ngang chân chống sau',
  outriggersFrontRetracted: 'Chân chống trước thu gọn',
  outriggersFrontExtension: 'Chân chống trước mở rộng',
  outriggersRearRetracted: 'Chân chống sau thu gọn',
  outriggersRearExtension: 'Chân chống sau mở rộng',
  outriggersConfigurations: 'Cấu hình chân chống',
  outriggerSpan: 'Khoảng cách chân chống',
  outriggerType: 'Loại chân chống',
  outriggerExtension: 'Độ duỗi chân chống',
  frontOutriggerSpan: 'Khoảng cách chân chống trước',
  rearOutriggerSpan: 'Khoảng cách chân chống sau',
  stabilizerForce: 'Lực chân chống',

  // Crane - Winch specs
  winchType: 'Loại tời',
  winchSpeed: 'Tốc độ tời',
  winchSingleLinePull: 'Lực kéo đơn tời',
  winchSingleLineSpeed: 'Tốc độ tời',  // Gộp với winchRatedSpeed - cùng thông số
  winchRatedSpeed: 'Tốc độ tời',  // Gộp với winchSingleLineSpeed - cùng thông số
  winchHookSpeed: 'Tốc độ móc tời',
  winchRopeType: 'Loại cáp tời',
  winchRopeDimension: 'Kích thước cáp tời',
  winchRopeLength: 'Chiều dài dây tời',
  winchRopeDiameter: 'Đường kính dây tời',
  winchBrakingStrength: 'Lực phanh tời',
  winchCableSpec: 'Thông số cáp tời',
  winchControl: 'Điều khiển tời',
  sheaveBlockCapacity: 'Sức nâng khối ròng rọc',
  sheaveBlockType: 'Loại khối ròng rọc',
  hoistingSpeed: 'Tốc độ nâng',
  loweringSpeed: 'Tốc độ hạ',
  subWinchCapacity: 'Sức nâng tời phụ',
  totalReachWithJib: 'Tầm với với cần jib',

  // Crane - Swing/Slewing specs
  slewing: 'Cơ cấu xoay',
  swingType: 'Loại cơ cấu xoay',
  swingAngle: 'Góc xoay',
  swingSpeed: 'Tốc độ xoay',
  swingTorque: 'Mô-men xoay',

  // Crane - Safety & Control
  safetySystem: 'Hệ thống an toàn',
  safetyFeatures: 'Hệ thống an toàn',
  safetyEquipment: 'Thiết bị an toàn',
  safetyHook: 'Móc an toàn',
  safetyValve: 'Van an toàn',
  overloadProtection: 'Bảo vệ quá tải',
  loadMomentLimiter: 'Giới hạn mô-men tải',
  antiTwoBlockSystem: 'Hệ thống chống 2 block',
  powerSource: 'Nguồn động lực',
  foldedHeight: 'Chiều cao khi gập',
  optionalFeatures: 'Tính năng tùy chọn',
  ratedLoadChart: 'Bảng tải trọng',
  detailedLiftingCapacity: 'Sức nâng chi tiết',

  // Tank specs
  compartments: 'Số ngăn',
  material: 'Vật liệu',
  thickness: 'Độ dày',
  valveSystem: 'Hệ thống van',
  pressureRating: 'Áp suất định mức',
  dischargingSystem: 'Hệ thống xả',
  liningMaterial: 'Vật liệu lót trong',
  insulationPresent: 'Cách nhiệt',
  heatingSystem: 'Hệ thống làm nóng',
  measurementSystem: 'Hệ thống đo lường',
  tankDimension: 'Kích thước bồn',
  tankDimensions: 'Kích thước bồn',
  tankCapacity: 'Dung tích bồn',
  tankVolume: 'Thể tích bồn',
  tankMaterial: 'Vật liệu bồn',
  tankShape: 'Hình dạng bồn',
  tankCode: 'Mã bồn',
  designPressure: 'Áp suất thiết kế',
  testPressure: 'Áp suất thử',
  workingPressure: 'Áp suất làm việc',
  normalPressure: 'Áp suất thường',
  pumpType: 'Loại bơm',
  pumpFlowRate: 'Lưu lượng bơm',
  pumpCapacity: 'Dung tích bơm',
  pumpPressure: 'Áp suất bơm',
  pumpPower: 'Công suất bơm',
  pumpModel: 'Model bơm',
  pumpMotor: 'Mô tơ bơm',
  pumpDrive: 'Dẫn động bơm',
  pumpSystem: 'Hệ thống bơm',
  pump: 'Bơm',
  flowMeter: 'Đồng hồ đo lưu lượng',
  certifications: 'Chứng nhận',
  capacityText: 'Dung tích',
  waveBarrier: 'Vách chống sóng',
  manhole: 'Lỗ người chui',
  breathingValve: 'Van thở',
  dischargePorts: 'Cửa xả',
  dischargeValve: 'Van xả',
  internationalStandard: 'Tiêu chuẩn quốc tế',

  // Tractor specs
  clutchType: 'Loại ly hợp',
  cabinType: 'Loại cabin',
  cabinSafety: 'An toàn cabin',
  cabinFeatures: 'Tính năng cabin',
  driverSeat: 'Ghế tài xế',
  fuelTankCapacity: 'Dung tích bình nhiên liệu',
  fuelTankCapacityText: 'Dung tích bình nhiên liệu',
  saddleHeight: 'Chiều cao bàn đỡ',
  fifthWheelType: 'Loại mâm kéo',
  maxTowingCapacity: 'Tải trọng kéo tối đa',
  maxTowingCapacityText: 'Tải trọng kéo tối đa',
  brakingSystem: 'Hệ thống phanh',
  autoSlackAdjuster: 'Tự động điều chỉnh khe hở phanh',
  exhaustBrake: 'Phanh khí xả',
  jakeBrake: 'Phanh động cơ',
  abs: 'ABS',
  retarder: 'Hãm phụ',
  retarderSystem: 'Hệ thống hãm',
  sleepingBerth: 'Giường nằm',
  sleepingBerthCount: 'Số giường',
  sleepingBerthSize: 'Kích thước giường',
  airConditioner: 'Điều hòa không khí',
  rearAxleGear: 'Bánh răng cầu sau',
  rearAxleRatio: 'Tỷ số truyền cầu sau',
  fuelSavings: 'Tiết kiệm nhiên liệu',
  tireSavings: 'Tiết kiệm lốp',
  interiorFeatures: 'Tính năng nội thất',

  // Box structures
  wallLayers: 'Số lớp vách',
  wallMaterial: 'Vật liệu vách',
  wallMaterials: 'Vật liệu vách',
  floorLayers: 'Số lớp sàn',
  floorMaterials: 'Vật liệu sàn',
  roofLayers: 'Số lớp mái',
  roofMaterials: 'Vật liệu mái',
  doorType: 'Loại cửa',
  doorCount: 'Số lượng cửa',
  insulationThickness: 'Độ dày cách nhiệt',
  insulationMaterial: 'Vật liệu cách nhiệt',
  refrigerationSystem: 'Hệ thống làm lạnh',
  refrigerationUnit: 'Cụm lạnh',
  temperatureRange: 'Phạm vi nhiệt độ',
  coolingUnit: 'Đơn vị làm lạnh',
  compressorType: 'Loại máy nén',
  refrigerantType: 'Loại môi chất lạnh',
  temperatureControl: 'Hệ thống điều khiển nhiệt độ',
  outerMaterial: 'Vật liệu bên ngoài',
  outerWallMaterial: 'Vật liệu vách ngoài',
  innerMaterial: 'Vật liệu bên trong',
  innerLiner: 'Lớp lót trong',
  loadingCapacity: 'Khả năng chịu tải',
  frameStructure: 'Cấu trúc khung',
  panelMaterial: 'Vật liệu panel',
  roofType: 'Loại mái',
  loadingSecurity: 'Hệ thống an toàn hàng hóa',
  reinforcement: 'Gia cường',
  waterproofing: 'Chống thấm nước',
  tarpaulinMaterial: 'Vật liệu bạt',
  tarpaulinThickness: 'Độ dày bạt',
  frameType: 'Loại khung',
  sideAccess: 'Khả năng tiếp cận bên hông',
  coverType: 'Loại mui phủ',
  sideType: 'Loại thành bên',
  sideRails: 'Thành bên',
  sideWalls: 'Vách bên',
  railing: 'Lan can',

  // Trailer specs
  rampType: 'Loại dốc',
  ramp: 'Dốc',
  rampLength: 'Chiều dài dốc',
  rampWidth: 'Chiều rộng dốc',
  rampCapacity: 'Sức tải dốc',
  rampAngle: 'Góc dốc',
  totalLength: 'Chiều dài tổng thể',
  loadingHeight: 'Chiều cao sàn',
  containerLock: 'Khóa container',
  containerTwistLock: 'Khóa xoáy container',
  trailerType: 'Loại rơ mooc',
  tieDownPoints: 'Điểm buộc hàng',
  tieDowns: 'Dây buộc',
  tieDownSystem: 'Hệ thống buộc hàng',

  // Performance
  maxSpeed: 'Tốc độ tối đa',
  climbingAbility: 'Khả năng leo dốc',
  gradability: 'Khả năng leo dốc',
  fuelSystem: 'Hệ thống nhiên liệu',
  travelSpeed: 'Tốc độ di chuyển',

  // Concrete mixer specs
  drumVolume: 'Thể tích bồn trộn',
  drumMaterial: 'Vật liệu bồn trộn',
  gearReducer: 'Bộ giảm tốc',
  rotationSpeed: 'Tốc độ quay',
  waterTank: 'Bình nước',
  waterTankCapacity: 'Dung tích bình nước',
  dischargeTrough: 'Máng đổ',
  mixerType: 'Loại bồn trộn',
  mixingTime: 'Thời gian trộn',
  residualConcrete: 'Bê tông dư',

  // Forklift specs
  liftCapacity: 'Sức nâng',
  maxLiftHeight: 'Chiều cao nâng tối đa',
  freeLift: 'Chiều cao tự do',
  forkLength: 'Chiều dài càng',
  forkWidth: 'Chiều rộng càng',
  mastType: 'Loại khung nâng',
  tiltAngle: 'Độ nghiêng khung',
  tiltCylinder: 'Xi lanh nghiêng',
  liftSpeedLoaded: 'Tốc độ nâng có tải',
  lowerSpeedLoaded: 'Tốc độ hạ có tải',
  travelSpeedLoaded: 'Tốc độ di chuyển có tải',
  travelSpeedUnloaded: 'Tốc độ di chuyển không tải',
  attachments: 'Phụ kiện đính kèm',
  stackingHeight: 'Chiều cao xếp chồng',

  // Man basket / Work platform
  basketCapacity: 'Sức chứa giỏ',
  basketDimensions: 'Kích thước giỏ',
  platformHeight: 'Chiều cao sàn',
  platformCapacity: 'Sức tải sàn',
  platformSize: 'Kích thước sàn',
  platformExtension: 'Mở rộng sàn',
  maxPlatformHeight: 'Chiều cao sàn tối đa',
  workingRadius: 'Bán kính làm việc',
  workingHeight: 'Chiều cao làm việc',

  // General equipment
  transportDimensions: 'Kích thước vận chuyển',
  operatingDimensions: 'Kích thước vận hành',
  engineBrand: 'Thương hiệu động cơ',
  engineOutput: 'Công suất động cơ',

  // Fire truck specs
  waterPumpType: 'Loại bơm nước',
  foamSystem: 'Hệ thống bọt',
  foamCapacity: 'Dung tích bọt',
  foamTankCapacity: 'Dung tích bình bọt',
  foamMixingRatio: 'Tỷ lệ trộn bọt',
  hoseReelCapacity: 'Dung lượng cuộn vòi',
  monitorGun: 'Súng phun',
  monitorRange: 'Tầm phun monitor',
  monitorRotation: 'Góc quay monitor',
  ladderLength: 'Chiều dài thang',
  ladderCapacity: 'Sức tải thang',
  rescueEquipment: 'Thiết bị cứu hộ',

  // Generator specs
  ratedPower: 'Công suất định mức',
  primePower: 'Công suất liên tục',
  standbyPower: 'Công suất dự phòng',
  frequency: 'Tần số',
  voltage: 'Điện áp',
  ratedVoltage: 'Điện áp định mức',
  phases: 'Số pha',
  powerFactor: 'Hệ số công suất',
  alternatorType: 'Loại máy phát',
  generatorBrand: 'Thương hiệu máy phát',
  controlPanel: 'Bảng điều khiển',
  ats: 'ATS',
  noiseLevel: 'Mức ồn',

  // Vacuum/Sewage truck specs
  vacuumPump: 'Bơm chân không',
  vacuumPumpType: 'Loại bơm chân không',
  vacuumLevel: 'Độ chân không',
  vacuumAirFlow: 'Lưu lượng khí',
  suctionHose: 'Ống hút',
  suctionDepth: 'Độ sâu hút',
  suctionDistance: 'Khoảng cách hút',
  suctionTime: 'Thời gian hút',
  unloadingSystem: 'Hệ thống xả',
  unloadingCapacity: 'Khả năng xả',

  // Street sweeper specs
  sweepingWidth: 'Chiều rộng quét',
  sweepingSpeed: 'Tốc độ quét',
  sweepingProductivity: 'Năng suất quét',
  dustBinCapacity: 'Dung tích thùng rác',
  brushDiameter: 'Đường kính chổi',
  sideBrushDiameter: 'Đường kính chổi bên',
  suctionNozzleWidth: 'Chiều rộng đầu hút',
  waterSpraySystem: 'Hệ thống phun nước',

  // Crane truck loading chart related (mostly excluded but kept for reference)
  radius: 'Bán kính tải',
  values: 'Giá trị tải',
  boomLengths: 'Các chiều dài cần (bảng tải)',
  note: 'Ghi chú',
  unit: 'Đơn vị',
  data: 'Dữ liệu bảng tải',

  // Vietnamese field names (from product JSON)
  thongSo: 'Thông số',
  kichThuoc: 'Kích thước',
  trongLuong: 'Trọng lượng',
  dongCo: 'Động cơ',
  khungGam: 'Khung gầm',
  hePhanh: 'Hệ phanh',
  cabin: 'Cabin',
  truyenDong: 'Truyền động',
  heDien: 'Hệ điện',
  thongTinChung: 'Thông tin chung',
  nhanHieu: 'Nhãn hiệu',
  tenThuongMai: 'Tên thương mại',
  loaiPhuongTien: 'Loại phương tiện',
  congThucBanhXe: 'Công thức bánh xe',
  xuatXu: 'Xuất xứ',
  kichThuocTongThe: 'Kích thước tổng thể',
  chieuDaiCoSo: 'Chiều dài cơ sở',
  vetBanhXe: 'Vết bánh xe',
  khoangSangGam: 'Khoảng sáng gầm',
  banKinhQuayVong: 'Bán kính quay vòng',
  trongLuongBanThan: 'Trọng lượng bản thân',
  taiTrongCauTruoc: 'Tải trọng cầu trước',
  taiTrongCauSau: 'Tải trọng cầu sau',
  tongTaiTrong: 'Tổng tải trọng',
  khoiLuongKeoTheo: 'Khối lượng kéo theo',
  tongTaiTrongDoanXe: 'Tổng tải trọng đoàn xe',
  dungTich: 'Dung tích',
  congSuat: 'Công suất',
  momenXoan: 'Mô-men xoắn',
  tieuChuanKhiThai: 'Tiêu chuẩn khí thải',
  hopSo: 'Hộp số',
  kieuLoai: 'Kiểu loại',
  maKieuLoai: 'Mã kiểu loại',
  lyHop: 'Ly hợp',
  cauSau: 'Cầu sau',
  khoaViSai: 'Khóa vi sai',
  khungXe: 'Khung xe',
  treoTruoc: 'Treo trước',
  treoSau: 'Treo sau',
  lopXe: 'Lốp xe',
  thungNhienLieu: 'Thùng nhiên liệu',
  mamKeo: 'Mâm kéo',
  phanhChinh: 'Phanh chính',
  phanhTay: 'Phanh tay',
  phanhKhiXa: 'Phanh khí xả',
  phanhDongCo: 'Phanh động cơ',
  giuongNam: 'Giường nằm',
  tocDoToiDa: 'Tốc độ tối đa',
  khaNangLeoDeo: 'Khả năng leo đèo',
  tietKiemNhienLieu: 'Tiết kiệm nhiên liệu',
  dienAp: 'Điện áp',
  mayPhatDien: 'Máy phát điện',
  hieuNangVanHanh: 'Hiệu năng vận hành',
};

// Nhóm thông số theo danh mục
const specCategoryOrder = [
  { key: 'basic', title: 'Thông số cơ bản' },
  { key: 'dimensions', title: 'Kích thước' },
  { key: 'weight', title: 'Trọng lượng' },
  { key: 'chassis', title: 'Khung gầm' },
  { key: 'axleAndSuspension', title: 'Trục & Hệ thống treo' },
  { key: 'systems', title: 'Hệ thống' },
  { key: 'body', title: 'Thùng/Thân xe' },
  { key: 'finishing', title: 'Hoàn thiện' },
  { key: 'engine', title: 'Động cơ & Vận hành' },
  { key: 'craneSpec', title: 'Thông số cẩu' },
  { key: 'trailerSpec', title: 'Thông số sơ mi rơ mooc' },
  { key: 'tractorSpec', title: 'Thông số đầu kéo' },
  { key: 'tankSpec', title: 'Thông số bồn xi téc' },
  { key: 'coolingBox', title: 'Thông số thùng đông lạnh' },
  { key: 'insulatedBox', title: 'Thông số thùng bảo ôn' },
  { key: 'closedBox', title: 'Thông số thùng kín' },
  { key: 'tarpaulinBox', title: 'Thông số thùng bạt' },
  { key: 'flatbedBox', title: 'Thông số thùng lửng' },
  { key: 'specifications', title: 'Thông số kỹ thuật' },
  { key: 'other', title: 'Thông tin khác' },
];

// Fields không hiển thị trong bảng so sánh (bao gồm các field trùng lặp)
const excludedFields = new Set([
  'id', 'slug', 'type', 'boxType', 'trailerType', 'isNew', 'isHot', 'isAvailable', 'isHidden', 'order',
  'thumbnailUrl', 'images', 'description', 'detailedDescription', 'features', 'faqs',
  'name', 'relatedProducts', 'seoKeywords', 'metaDescription', 'craneType',
  // Các field từ bảng tải trọng - không hiển thị riêng lẻ
  'ratedLoadChart', 'detailedLiftingCapacity', 'boomLengths', 'data', 'values', 'radius', 'note', 'unit',
  // Các field tính năng - tránh trùng lặp với thông số chi tiết
  'optionalFeatures', 'cabinFeatures', 'specialFeatures', 'interiorFeatures',
  // Các field cần cẩu trùng lặp - giữ lại boomLength là chính
  'boomRetractedLength', 'boomExtendedLength', 'boomMinLength', 'boomMaxLength',
]);

// Path aliases - các field có cùng ý nghĩa, khi lấy giá trị sẽ thử tất cả aliases
const pathAliases: Record<string, string[]> = {
  // An toàn - safetySystem và safetyFeatures là cùng 1 thông số
  'craneSpec.safetySystem': ['craneSpec.safetyFeatures'],
  'craneSpec.safetyFeatures': ['craneSpec.safetySystem'],

  // Trọng lượng cẩu - STD là phiên bản tiêu chuẩn = bản thường (không có ghế làm việc trên cao)
  // craneOperatingWeight và craneOperatingWeightSTD là cùng 1 thông số
  'craneSpec.craneOperatingWeight': ['craneSpec.craneOperatingWeightSTD'],
  'craneSpec.craneOperatingWeightSTD': ['craneSpec.craneOperatingWeight'],

  // craneNetWeight và craneNetWeightSTD là cùng 1 thông số (trọng lượng tịnh)
  'craneSpec.craneNetWeight': ['craneSpec.craneNetWeightSTD'],
  'craneSpec.craneNetWeightSTD': ['craneSpec.craneNetWeight'],

  // Tốc độ tời - winchRatedSpeed và winchSingleLineSpeed là cùng 1 thông số
  // SCS1015LS dùng winchRatedSpeed, các cẩu khác dùng winchSingleLineSpeed
  'craneSpec.winchRatedSpeed': ['craneSpec.winchSingleLineSpeed'],
  'craneSpec.winchSingleLineSpeed': ['craneSpec.winchRatedSpeed'],
};

// Hàm chuyển camelCase thành tiếng Việt đọc được
const camelToLabel = (str: string): string => {
  // Kiểm tra mapping trước
  if (labelMappings[str]) return labelMappings[str];

  // Chuyển camelCase thành words
  const result = str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return result;
};

// Hàm lấy label cho một path
const getLabel = (path: string): string => {
  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];
  return labelMappings[lastPart] || camelToLabel(lastPart);
};

// Hàm lấy giá trị nested từ object (core implementation)
const getNestedValueCore = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;

  const parts = path.split('.');
  let value = obj;

  for (const part of parts) {
    if (value === null || value === undefined) return undefined;
    value = value[part];
  }

  return value;
};

// Hàm lấy giá trị nested từ object - có hỗ trợ path aliases
const getNestedValue = (obj: any, path: string): any => {
  // Thử path chính trước
  let value = getNestedValueCore(obj, path);

  // Nếu không có giá trị và có alias, thử các alias
  if ((value === undefined || value === null) && pathAliases[path]) {
    for (const aliasPath of pathAliases[path]) {
      value = getNestedValueCore(obj, aliasPath);
      if (value !== undefined && value !== null) {
        break;
      }
    }
  }

  return value;
};

// Hàm format giá trị để hiển thị
const formatValue = (value: any): string => {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// Hàm format giá tiền
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

// Hàm thu thập tất cả specs từ một object nested
const collectSpecs = (
  obj: any,
  prefix: string,
  result: Map<string, { category: string; path: string; label: string }>
) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;

  for (const key of Object.keys(obj)) {
    if (excludedFields.has(key)) continue;

    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object - recurse into it
      collectSpecs(value, fullPath, result);
    } else {
      // Leaf value - add to result
      const category = prefix.split('.')[0] || 'basic';
      result.set(fullPath, {
        category,
        path: fullPath,
        label: getLabel(fullPath),
      });
    }
  }
};

const CompareTable: React.FC<CompareTableProps> = ({ trucks }) => {
  const { removeFromCompare, clearCompare } = useCompare();

  // Thu thập tất cả specs từ tất cả trucks
  const allSpecs = useMemo(() => {
    const specsMap = new Map<string, { category: string; path: string; label: string }>();

    for (const truck of trucks) {
      // Thu thập các field top-level
      const topLevelFields = ['brand', 'model', 'weightText', 'dimensions', 'priceText', 'origin', 'tires', 'seats', 'warranty'];
      for (const field of topLevelFields) {
        if (truck[field as keyof Truck] !== undefined && truck[field as keyof Truck] !== null) {
          specsMap.set(field, {
            category: 'basic',
            path: field,
            label: labelMappings[field] || field,
          });
        }
      }

      // Thu thập từ specifications
      if (truck.specifications) {
        for (const key of Object.keys(truck.specifications)) {
          if (!excludedFields.has(key)) {
            specsMap.set(`specifications.${key}`, {
              category: 'specifications',
              path: `specifications.${key}`,
              label: getLabel(key),
            });
          }
        }
      }

      // Thu thập từ các spec objects
      const specObjects = [
        'trailerSpec', 'craneSpec', 'tractorSpec', 'tankSpec',
        'coolingBox', 'insulatedBox', 'closedBox', 'tarpaulinBox', 'flatbedBox'
      ];

      for (const specKey of specObjects) {
        const specObj = truck[specKey as keyof Truck];
        if (specObj && typeof specObj === 'object') {
          collectSpecs(specObj, specKey, specsMap);
        }
      }
    }

    return specsMap;
  }, [trucks]);

  // Nhóm specs theo category VÀ loại bỏ trùng lặp theo label
  const groupedSpecs = useMemo(() => {
    const groups = new Map<string, Array<{ path: string; label: string }>>();

    // Tạo một map theo label để detect trùng lặp
    const labelToPath = new Map<string, string>();

    for (const [, spec] of allSpecs) {
      const { category, path, label } = spec;

      // Kiểm tra trùng lặp theo label
      if (labelToPath.has(label)) {
        const existingPath = labelToPath.get(label)!;
        // Ưu tiên path dài hơn (chi tiết hơn, ví dụ: craneSpec.boomLength > boomLength)
        if (path.length > existingPath.length) {
          // Xóa path cũ khỏi groups
          for (const [groupKey, specs] of groups) {
            const idx = specs.findIndex(s => s.path === existingPath);
            if (idx !== -1) {
              specs.splice(idx, 1);
              if (specs.length === 0) {
                groups.delete(groupKey);
              }
              break;
            }
          }
          labelToPath.set(label, path);
        } else {
          // Path hiện tại ngắn hơn hoặc bằng -> bỏ qua
          continue;
        }
      } else {
        labelToPath.set(label, path);
      }

      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push({ path, label });
    }

    // Sắp xếp theo thứ tự đã định nghĩa
    const orderedGroups: Array<{ title: string; specs: Array<{ path: string; label: string }> }> = [];

    for (const { key, title } of specCategoryOrder) {
      const specs = groups.get(key);
      if (specs && specs.length > 0) {
        // Sắp xếp specs bên trong craneSpec để các field trọng lượng lên đầu
        if (key === 'craneSpec') {
          const priorityFields = [
            'model',  // Model đầu tiên để người dùng biết đang xem thông số sản phẩm nào
            'applicableTruckChassis',
            'craneOperatingWeight',
            'craneOperatingWeightSTD',
            'craneOperatingWeightTopSeat',
            'craneNetWeight',
            'craneNetWeightSTD',
            'craneNetWeightTopSeat',
            'craneWeight',
            // Sức nâng & Tầm vươn
            'maxLiftingMoment',
            'liftingCapacity',
            'liftingCapacityText',
            'maxLiftingHeight',
            'maxHeightBelowGround',
            'minWorkingRadius',
            'maxWorkingRadius',
            // Cần chính
            'boomType',
            'boomSections',
            'boomLength',
            'boomExtensionSpeed',
            'boomLuffingAngle',
            'boomLuffingSpeed',
            // Cần phụ (Jib) - đặt gần nhau
            'jibBoom',
            'totalReachWithJib',
            // Tời (Winch) - đặt tất cả các field tời gần nhau
            'winchType',
            'winchSingleLinePull',
            'winchSingleLineSpeed',  // Gộp với winchRatedSpeed
            'winchRatedSpeed',  // Gộp với winchSingleLineSpeed
            'winchHookSpeed',
            'winchRopeType',
            'winchRopeDimension',
            'winchBrakingStrength',
          ];

          specs.sort((a, b) => {
            const fieldA = a.path.split('.').pop() || '';
            const fieldB = b.path.split('.').pop() || '';
            const indexA = priorityFields.indexOf(fieldA);
            const indexB = priorityFields.indexOf(fieldB);

            // Nếu cả 2 đều trong priority list, sắp theo thứ tự priority
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // Nếu chỉ A trong priority → A lên trước
            if (indexA !== -1) return -1;
            // Nếu chỉ B trong priority → B lên trước
            if (indexB !== -1) return 1;
            // Còn lại giữ nguyên
            return 0;
          });
        }

        orderedGroups.push({ title, specs });
      }
    }

    // Thêm các category không nằm trong order list
    for (const [category, specs] of groups) {
      if (!specCategoryOrder.find(c => c.key === category) && specs.length > 0) {
        orderedGroups.push({ title: category, specs });
      }
    }

    return orderedGroups;
  }, [allSpecs]);

  // Hàm lấy giá trị cho một truck và path
  const getValue = (truck: Truck, path: string): string => {
    // Handle special cases
    if (path === 'priceText') {
      return truck.priceText || (typeof truck.price === 'number' ? formatPrice(truck.price) : '-');
    }
    if (path === 'brand') {
      const brand = truck.brand;
      if (!brand) return '-';
      if (Array.isArray(brand)) return brand.join(' & ');
      return String(brand);
    }

    const value = getNestedValue(truck, path);
    return formatValue(value);
  };

  // Kiểm tra xem có ít nhất 1 truck có giá trị cho path không
  const hasAnyValue = (path: string): boolean => {
    return trucks.some(truck => {
      const value = getNestedValue(truck, path);
      return value !== undefined && value !== null && value !== '';
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Đang so sánh {trucks.length} xe</h2>
        <Button
          onClick={clearCompare}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Xóa tất cả
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 border-r-2" style={{ width: '25%' }}>Thông tin</th>
              {trucks.map((truck) => (
                <th
                  key={truck.id}
                  className="p-4 relative"
                  style={{ width: `${75 / trucks.length}%` }}
                >
                  <Button
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCompare(truck.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="pt-4">
                    <div className="mb-3 flex justify-center">
                      <OptimizedImage
                        src={truck.thumbnailUrl}
                        alt={truck.name}
                        className="w-40 h-28 object-contain"
                        useCase="thumbnail"
                      />
                    </div>
                    <a href={`/${truck.type}/${truck.slug}`} className="font-bold text-lg hover:text-primary transition-colors">
                      {truck.name}
                    </a>
                    <div className="text-xs text-gray-500 mt-1">
                      {getCategoryName(truck.type)}
                      {truck.boxType && <span> - {getBoxTypeName(truck.boxType)}</span>}
                      {truck.trailerType && <span> - {getTrailerTypeName(truck.trailerType)}</span>}
                    </div>
                    <div className="text-lg font-bold text-primary mt-2">
                      {truck.priceText}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groupedSpecs.map((group) => (
              <React.Fragment key={group.title}>
                <tr className="bg-gray-50">
                  <td colSpan={trucks.length + 1} className="p-3 font-semibold text-base">
                    {group.title}
                  </td>
                </tr>

                {group.specs.filter(spec => hasAnyValue(spec.path)).map((spec) => (
                  <tr key={spec.path} className="border-b">
                    <td className="p-3 font-medium border-r-2">{spec.label}</td>

                    {trucks.map((truck) => (
                      <td key={`${truck.id}-${spec.path}`} className="p-3 text-center">
                        {getValue(truck, spec.path)}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;
