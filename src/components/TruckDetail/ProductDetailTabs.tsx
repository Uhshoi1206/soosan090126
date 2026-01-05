import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import ContactForm from '../ContactForm';
import CostEstimator from './CostEstimator';
import { Truck } from '@/models/TruckTypes';

interface ProductDetailTabsProps {
  truck: Truck;
}

interface TabDefinition {
  value: string;
  label: string;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ truck }) => {
  const getTabs = (): TabDefinition[] => {
    return [
      { value: 'description', label: 'Mô tả chi tiết' },
      { value: 'specs', label: 'Thông số kỹ thuật' },
      { value: 'contact', label: 'Liên hệ tư vấn' }
    ];
  };

  const tabs = getTabs();

  const renderSpecTable = (specs: Record<string, any>, title?: string) => {
    if (!specs || Object.keys(specs).length === 0) return null;

    // Mapping English keys to Vietnamese labels
    const displayNames: Record<string, string> = {
      // Thùng kín (closedBox)
      wallMaterial: 'Vật liệu vách thùng',
      floorMaterial: 'Vật liệu sàn',
      sideHeight: 'Chiều cao thành bên',
      doorType: 'Loại cửa',
      insulation: 'Cách nhiệt',
      reinforcement: 'Gia cường',
      // Thùng bạt (tarpaulinBox)
      frameStructure: 'Cấu trúc khung',
      tarpaulinMaterial: 'Vật liệu bạt',
      tarpaulinThickness: 'Độ dày bạt',
      frameType: 'Loại khung',
      sideAccess: 'Khả năng bốc dỡ',
      coverType: 'Loại mui phủ',
      roofType: 'Loại mui',
      // Thùng bảo ôn (insulatedBox)
      insulationMaterial: 'Vật liệu cách nhiệt',
      insulationThickness: 'Độ dày cách nhiệt',
      temperatureRange: 'Dải nhiệt độ',
      // Thùng lạnh (coolingBox)
      coolingUnit: 'Thiết bị làm lạnh',
      coolingCapacity: 'Công suất làm lạnh',
      minTemperature: 'Nhiệt độ tối thiểu',
      maxTemperature: 'Nhiệt độ tối đa',
      // Common fields
      material: 'Vật liệu',
      dimensions: 'Kích thước',
      length: 'Chiều dài',
      width: 'Chiều rộng',
      height: 'Chiều cao',
      capacity: 'Dung tích',
      fuelTankCapacity: 'Dung tích bình nhiên liệu',
      volume: 'Thể tích'
    };

    return (
      <div className="mb-6">
        {title && <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">{title}</h4>}
        <table className="w-full border-collapse border">
          <tbody>
            {Object.entries(specs).map(([key, value]) => {
              if (!value || key === 'length' || key === 'width' || key === 'height') return null;
              const displayName = displayNames[key] || key;
              return (
                <tr key={key} className="border-b">
                  <td className="py-2 px-3 text-gray-600 w-1/3">{displayName}</td>
                  <td className="py-2 px-3 font-medium">{String(value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Tabs defaultValue="description" className="mt-12">
      <TabsList
        className={`grid w-full bg-transparent p-0 h-auto border-b border-gray-200`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 py-3 px-4 font-medium hover:text-blue-600 transition-colors"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="description" className="p-6 bg-white border-x border-b mt-0">
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-gray-700">{truck.description}</p>
          {truck.detailedDescription && (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: truck.detailedDescription }}
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="specs" className="p-6 bg-white border-x border-b mt-0">
        <div>
          <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số kỹ thuật chung</h4>
          <table className="w-full border-collapse border mb-6">
            <tbody>
              {truck.model && (
                <tr className="border-b bg-blue-50">
                  <td className="py-2 px-3 text-gray-600 w-1/3 font-semibold">Model</td>
                  <td className="py-2 px-3 font-bold text-blue-700">{truck.model}</td>
                </tr>
              )}
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-600 w-1/3">Thương hiệu</td>
                <td className="py-2 px-3 font-medium">{Array.isArray(truck.brand) ? truck.brand.join(', ') : truck.brand}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-600">{truck.type === 'may-moc-thiet-bi' || truck.type === 'can-cau' ? 'Khối lượng bản thân' : 'Tải trọng'}</td>
                <td className="py-2 px-3 font-medium">{truck.weightText}</td>
              </tr>
              {/* CHỈ hiển thị nếu KHÔNG có trailerSpec.dimensions để tránh duplicate */}
              {!truck.trailerSpec?.dimensions && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Kích thước tổng thể (D×R×C)</td>
                  <td className="py-2 px-3 font-medium">{truck.dimensions}</td>
                </tr>
              )}
              {truck.insideDimension && !truck.trailerSpec?.dimensions && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Kích thước lòng thùng (D×R×C)</td>
                  <td className="py-2 px-3 font-medium">{truck.insideDimension}</td>
                </tr>
              )}
              {truck.wheelbaseText && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Chiều dài cơ sở</td>
                  <td className="py-2 px-3 font-medium">{truck.wheelbaseText}</td>
                </tr>
              )}
              {truck.groundClearance && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Khoảng sáng gầm xe</td>
                  <td className="py-2 px-3 font-medium">{truck.groundClearance} mm</td>
                </tr>
              )}
              {truck.turningRadius !== undefined && truck.turningRadius > 0 && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Bán kính quay vòng tối thiểu</td>
                  <td className="py-2 px-3 font-medium">{truck.turningRadius} m</td>
                </tr>
              )}
              {truck.maxSpeed && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Tốc độ tối đa</td>
                  <td className="py-2 px-3 font-medium">{truck.maxSpeed}</td>
                </tr>
              )}
              {truck.climbingAbility && (
                <tr className="border-b bg-green-50">
                  <td className="py-2 px-3 text-gray-600">Khả năng leo dốc</td>
                  <td className="py-2 px-3 font-medium text-green-700">{truck.climbingAbility}</td>
                </tr>
              )}
              {truck.origin && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Xuất xứ</td>
                  <td className="py-2 px-3 font-medium">{truck.origin}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Thông số động cơ chi tiết */}
          {(truck.engineModel || truck.engineCapacity || truck.enginePower || truck.engineTorque) && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Động cơ & Hệ truyền động</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.engineModel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Mã động cơ</td>
                      <td className="py-2 px-3 font-medium">{truck.engineModel}</td>
                    </tr>
                  )}
                  {truck.engineType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại động cơ</td>
                      <td className="py-2 px-3 font-medium">{truck.engineType}</td>
                    </tr>
                  )}
                  {truck.engineCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dung tích xy-lanh</td>
                      <td className="py-2 px-3 font-medium">{truck.engineCapacity}</td>
                    </tr>
                  )}
                  {truck.enginePower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Công suất cực đại</td>
                      <td className="py-2 px-3 font-medium">{truck.enginePower}</td>
                    </tr>
                  )}
                  {truck.engineTorque && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mô-men xoắn cực đại</td>
                      <td className="py-2 px-3 font-medium">{truck.engineTorque}</td>
                    </tr>
                  )}
                  {truck.fuel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.fuel}</td>
                    </tr>
                  )}
                  {truck.emissionStandard && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tiêu chuẩn khí thải</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.emissionStandard}</td>
                    </tr>
                  )}
                  {truck.transmission && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.transmission}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số trọng lượng - CHỈ hiển thị nếu KHÔNG có trailerSpec.weight để tránh duplicate */}
          {(truck.kerbWeight || truck.grossWeight) && !truck.trailerSpec?.weight && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Trọng lượng</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.kerbWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Trọng lượng bản thân</td>
                      <td className="py-2 px-3 font-medium">{truck.kerbWeight}</td>
                    </tr>
                  )}
                  <tr className="border-b">
                    <td className="py-2 px-3 text-gray-600">Tải trọng cho phép chở</td>
                    <td className="py-2 px-3 font-medium">{truck.weightText}</td>
                  </tr>
                  {truck.grossWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Trọng lượng toàn bộ</td>
                      <td className="py-2 px-3 font-medium">{truck.grossWeight}</td>
                    </tr>
                  )}
                  {truck.frontAxleLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng cầu trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontAxleLoad}</td>
                    </tr>
                  )}
                  {truck.rearAxleLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng cầu sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearAxleLoad}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số khung gầm, treo, phanh */}
          {(truck.chassisMaterial || truck.frontSuspension || truck.rearSuspension || truck.frontBrake || truck.rearBrake || truck.tires) && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Khung gầm & Hệ thống treo & Phanh</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.chassisMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khung gầm</td>
                      <td className="py-2 px-3 font-medium">{truck.chassisMaterial}</td>
                    </tr>
                  )}
                  {truck.frontSuspension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống treo trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontSuspension}</td>
                    </tr>
                  )}
                  {truck.rearSuspension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống treo sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearSuspension}</td>
                    </tr>
                  )}
                  {truck.frontBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phanh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontBrake}</td>
                    </tr>
                  )}
                  {truck.rearBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phanh sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearBrake}</td>
                    </tr>
                  )}
                  {truck.brakeSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống phanh</td>
                      <td className="py-2 px-3 font-medium">{truck.brakeSystem}</td>
                    </tr>
                  )}
                  {truck.parkingBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phanh tay</td>
                      <td className="py-2 px-3 font-medium">{truck.parkingBrake}</td>
                    </tr>
                  )}
                  {truck.steeringType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống lái</td>
                      <td className="py-2 px-3 font-medium">{truck.steeringType}</td>
                    </tr>
                  )}
                  {truck.tires && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lốp xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tires}</td>
                    </tr>
                  )}
                  {truck.driveType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ dẫn động</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.driveType}</td>
                    </tr>
                  )}
                  {truck.trackWidthFront && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vệt bánh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.trackWidthFront}</td>
                    </tr>
                  )}
                  {truck.trackWidthRear && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vệt bánh sau</td>
                      <td className="py-2 px-3 font-medium">{truck.trackWidthRear}</td>
                    </tr>
                  )}
                  {truck.fuelTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bình nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.fuelTankCapacity}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số cabin và tiện nghi */}
          {(truck.cabinType || truck.seats || (truck.cabinFeatures && truck.cabinFeatures.length > 0)) && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Nội thất & Tiện nghi</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.cabinType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại cabin</td>
                      <td className="py-2 px-3 font-medium">{truck.cabinType}</td>
                    </tr>
                  )}
                  {truck.seats && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số chỗ ngồi</td>
                      <td className="py-2 px-3 font-medium">{truck.seats} chỗ</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {truck.cabinFeatures && truck.cabinFeatures.length > 0 && (
                <div className="mb-6 p-4 border rounded bg-blue-50">
                  <p className="font-medium text-gray-700 mb-2">Trang bị tiện nghi:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {truck.cabinFeatures.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Thông số bổ sung từ specifications object */}
          {truck.specifications && Object.keys(truck.specifications).length > 0 && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số khác</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {Object.entries(truck.specifications).map(([key, value]) => {
                    if (!value) return null;
                    // Chuyển đổi key sang tên hiển thị
                    const displayNames: Record<string, string> = {
                      fuelTankCapacity: 'Dung tích bình nhiên liệu',
                      wadingDepth: 'Khả năng lội nước',
                      airIntakePosition: 'Vị trí cổ hút gió',
                      maxSpeed: 'Tốc độ tối đa',
                      fuelConsumption: 'Mức tiêu thụ nhiên liệu',
                      climbingAbility: 'Khả năng leo dốc',
                      oilChangeInterval: 'Chu kỳ thay dầu',
                      electricSystem: 'Hệ thống điện',
                      dumpVolume: 'Thể tích thùng ben',
                      fuelSystem: 'Hệ thống nhiên liệu',
                      pumpCapacity: 'Công suất bơm',
                      maxPressure: 'Áp suất tối đa',
                      tankVolume: 'Dung tích bồn chứa'
                    };
                    const displayName = displayNames[key] || key;
                    return (
                      <tr key={key} className="border-b">
                        <td className="py-2 px-3 text-gray-600 w-1/3">{displayName}</td>
                        <td className="py-2 px-3 font-medium">{String(value)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {truck.tractorSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số đầu kéo</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tractorSpec.horsepower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.horsepower} HP</td>
                    </tr>
                  )}
                  {truck.tractorSpec.torque && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mô-men xoắn</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.torque}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.transmission && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.transmission}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.transmissionType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.transmissionType}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.axleConfiguration && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Công thức bánh xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.axleConfiguration}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.maxTowingCapacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khả năng kéo tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.maxTowingCapacityText}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.designTowingCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng kéo thiết kế</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.designTowingCapacity}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.kerbWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khối lượng bản thân</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.kerbWeight}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.grossWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khối lượng toàn bộ</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.grossWeight}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.fifthWheelType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mâm kéo</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.fifthWheelType}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.fifthWheelLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng mâm kéo</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.fifthWheelLoad}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.fuelTankCapacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dung tích bình nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.fuelTankCapacityText}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.cabinType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cabin</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.cabinType}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.maxSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.maxSpeed}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.climbingAbility && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khả năng leo dốc</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.climbingAbility}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.turningRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính quay vòng</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.turningRadius}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.brakingSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống phanh</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.brakingSystem}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.frontAxle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Treo trước</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.frontAxle}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.rearAxle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Treo sau</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.rearAxle}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.trackWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vết bánh xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.trackWidth}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.frameSpec && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khung xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.frameSpec}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.electricSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điện</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.electricSystem}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Interior Features */}
              {truck.tractorSpec.interiorFeatures && truck.tractorSpec.interiorFeatures.length > 0 && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Tiện nghi nội thất</h4>
                  <div className="mb-6 p-4 border rounded">
                    <ul className="list-disc list-inside space-y-1">
                      {truck.tractorSpec.interiorFeatures.map((feature: string, index: number) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}

          {truck.trailerSpec && (
            <>
              {/* Nhóm Kích thước */}
              {truck.trailerSpec.dimensions && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Kích thước</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.dimensions.overallDimensions && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước tổng thể (D x R x C)</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.overallDimensions}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.containerDimensions && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Kích thước lòng thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.containerDimensions}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.wheelbase && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Chiều dài cơ sở</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.wheelbase}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.capacity && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Thể tích thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.capacity}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.cargoBoxDimensions && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Kích thước lòng thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.cargoBoxDimensions}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.numberOfLevels && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600">Số tầng</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.dimensions.numberOfLevels}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Trọng lượng */}
              {truck.trailerSpec.weight && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Trọng lượng</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.weight.curbWeight && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Khối lượng bản thân</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.curbWeight}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.weight.payload && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Khối lượng chở cho phép</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.payload}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.weight.grossWeight && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Khối lượng toàn bộ</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.grossWeight}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.weight.kingpinLoad && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Tải trọng lên chốt kéo</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.kingpinLoad}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Kết cấu khung */}
              {truck.trailerSpec.chassis && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Kết cấu khung</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.chassis.mainBeam && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Dầm chính</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.mainBeam}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.chassis.frameMaterial && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu khung</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.frameMaterial}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.chassis.landingGear && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chân chống</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.landingGear}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.chassis.kingpin && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chốt kéo</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.kingpin}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Trục và hệ thống treo */}
              {truck.trailerSpec.axleAndSuspension && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Trục và hệ thống treo</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.axleAndSuspension.axleType && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Loại trục</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.axleType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.axleCount && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Số trục</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.axleCount} trục</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.liftingAxle && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600">Tính năng đặc biệt</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.axleAndSuspension.liftingAxle}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.springType && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Loại nhíp</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.springType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.springDimension && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Tiết diện lá nhíp</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.springDimension}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.tireSpec && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Lốp xe</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.tireSpec}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Hệ thống */}
              {truck.trailerSpec.systems && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.systems.brakeSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống phanh</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.brakeSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.electricSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Hệ thống điện</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.electricSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.hydraulicSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Hệ thống thủy lực</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.hydraulicSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.vacuumPump && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Bơm hút chân không</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.vacuumPump}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.pneumaticSystem && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600">Hệ thống khí nén</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.systems.pneumaticSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.heatingSystem && (
                        <tr className="border-b bg-orange-50">
                          <td className="py-2 px-3 text-gray-600">Hệ thống gia nhiệt</td>
                          <td className="py-2 px-3 font-medium text-orange-700">{truck.trailerSpec.systems.heatingSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.pumpSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Hệ thống bơm</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.pumpSystem}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Thùng/thân xe */}
              {truck.trailerSpec.body && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thùng/thân xe</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.body.frameType && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Loại khung</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.frameType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.containerLocks && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chốt hãm container</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.body.containerLocks}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.material && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.material}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.ramp && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Cầu dẫn xe</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.body.ramp}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.tieDowns && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Móc chằng buộc</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.body.tieDowns}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.sideRails && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Lan can bảo vệ</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.sideRails}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.wheelChocks && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chặn bánh xe</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.wheelChocks}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.insulation && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Cách nhiệt</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.insulation}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.temperatureRange && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Dải nhiệt độ</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.temperatureRange}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.capacity && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.capacity}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.waveBarrier && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vách chắn sóng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.waveBarrier}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.valveSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống van</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.valveSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.designPressure && (
                        <tr className="border-b bg-red-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thiết kế</td>
                          <td className="py-2 px-3 font-medium text-red-700">{truck.trailerSpec.body.designPressure}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.testPressure && (
                        <tr className="border-b bg-red-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thử bền</td>
                          <td className="py-2 px-3 font-medium text-red-700">{truck.trailerSpec.body.testPressure}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.compartments && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Số khoang</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.compartments}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.cargoType && (
                        <tr className="border-b bg-amber-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chất chuyên chở</td>
                          <td className="py-2 px-3 font-medium text-amber-700">{truck.trailerSpec.body.cargoType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.floorMaterial && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu đáy thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.floorMaterial}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.unloadingSystem && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống xả hàng</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.body.unloadingSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.unloadingCapacity && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng xả</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.body.unloadingCapacity}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.designTemperature && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Nhiệt độ thiết kế</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.body.designTemperature}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.operatingTemperature && (
                        <tr className="border-b bg-orange-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Nhiệt độ vận hành</td>
                          <td className="py-2 px-3 font-medium text-orange-700">{truck.trailerSpec.body.operatingTemperature}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.sideWallMaterial && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Vật liệu thành thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.sideWallMaterial}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.reinforcement && (
                        <tr className="border-b bg-amber-50">
                          <td className="py-2 px-3 text-gray-600">Kết cấu tăng cường</td>
                          <td className="py-2 px-3 font-medium text-amber-700">{truck.trailerSpec.body.reinforcement}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.crossBeams && (
                        <tr className="border-b bg-amber-50">
                          <td className="py-2 px-3 text-gray-600">Giàng ngang đáy</td>
                          <td className="py-2 px-3 font-medium text-amber-700">{truck.trailerSpec.body.crossBeams}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Hoàn thiện */}
              {truck.trailerSpec.finishing && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hoàn thiện</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.finishing.paintProcess && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Công nghệ sơn</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.finishing.paintProcess}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.finishing.paintColor && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Màu sơn</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.finishing.paintColor}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.finishing.warranty && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Bảo hành</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.finishing.warranty}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}

          {truck.craneSpec && (
            <>
              {/* THÔNG TIN CHUNG */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-blue-500">Thông tin chung</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.model && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Model cẩu</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.model}</td>
                    </tr>
                  )}
                  {truck.craneSpec.applicableTruckChassis && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Xe chassis phù hợp</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.applicableTruckChassis}</td>
                    </tr>
                  )}
                  {truck.craneSpec.craneOperatingWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khối lượng bản thân</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.craneOperatingWeight}</td>
                    </tr>
                  )}
                  {truck.craneSpec.craneNetWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Trọng lượng thân cẩu</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.craneNetWeight}</td>
                    </tr>
                  )}
                  {truck.craneSpec.craneOperatingWeightSTD && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khối lượng bản thân (STD)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.craneOperatingWeightSTD}</td>
                    </tr>
                  )}
                  {truck.craneSpec.craneOperatingWeightTopSeat && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khối lượng bản thân (có ghế làm việc)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.craneOperatingWeightTopSeat}</td>
                    </tr>
                  )}
                  {truck.craneSpec.craneNetWeightSTD && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Trọng lượng thân cẩu (STD)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.craneNetWeightSTD}</td>
                    </tr>
                  )}
                  {truck.craneSpec.craneNetWeightTopSeat && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Trọng lượng thân cẩu (có ghế làm việc)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.craneNetWeightTopSeat}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* SỨC NÂNG (CRANE CAPACITY) */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-red-500">Sức nâng (Crane Capacity)</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.maxLiftingMoment && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Mômen nâng lớn nhất</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxLiftingMoment}</td>
                    </tr>
                  )}
                  {(truck.craneSpec.liftingCapacityText || truck.craneSpec.maxLiftingCapacity) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sức nâng / Bán kính</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.liftingCapacityText || truck.craneSpec.maxLiftingCapacity}</td>
                    </tr>
                  )}
                  {(truck.craneSpec.maxLiftingHeight || truck.craneSpec.maxLiftHeight) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng (trên mặt đất)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxLiftingHeight || truck.craneSpec.maxLiftHeight}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxHeightBelowGround && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng (dưới mặt đất)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxHeightBelowGround}</td>
                    </tr>
                  )}
                  {truck.craneSpec.minWorkingRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bán kính làm việc tối thiểu</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.minWorkingRadius}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxWorkingRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bán kính làm việc tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxWorkingRadius}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* CẦN CẨU (BOOM) */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-sky-500">Cần cẩu (Boom)</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.boomType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomSections && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số đốt cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomSections}</td>
                    </tr>
                  )}
                  {(truck.craneSpec.boomLength || truck.craneSpec.maxBoomLength) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều dài cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomLength || truck.craneSpec.maxBoomLength}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomExtensionSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ ra cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomExtensionSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomLuffingAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nâng cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomLuffingAngle}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomLuffingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ nâng cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomLuffingSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxJibLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều dài cần phụ</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxJibLength}</td>
                    </tr>
                  )}
                  {truck.craneSpec.tipLoadCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sức nâng đầu cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.tipLoadCapacity}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* TỜI (WINCH) */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-purple-500">Tời (Winch)</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.winchType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại tời</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchSingleLinePull && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lực kéo đơn</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchSingleLinePull}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchRatedSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ cuộn (dây đơn)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchRatedSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchHookSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ móc (ròng rọc)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchHookSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.sheaveBlockCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sức nâng khối ròng rọc</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.sheaveBlockCapacity}</td>
                    </tr>
                  )}
                  {truck.craneSpec.sheaveBlockType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại khối ròng rọc</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.sheaveBlockType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchRopeType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cấu tạo dây cáp (JIS)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchRopeType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchRopeDimension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đường kính x Chiều dài cáp</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchRopeDimension}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchBrakingStrength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lực phanh cáp</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchBrakingStrength}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* XOAY (SLEWING) */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-indigo-500">Xoay toa (Slewing)</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.swingType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại xoay</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.swingType}</td>
                    </tr>
                  )}
                  {(truck.craneSpec.swingAngle || truck.craneSpec.slewingAngle) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc quay</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.swingAngle || truck.craneSpec.slewingAngle}</td>
                    </tr>
                  )}
                  {(truck.craneSpec.swingSpeed || truck.craneSpec.slewingSpeed) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ quay</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.swingSpeed || truck.craneSpec.slewingSpeed}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* CHÂN CHỐNG (OUTRIGGERS) */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-green-500">Chân chống (Outriggers)</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.outriggersType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại chân chống</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersVerticalJacks && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích đứng</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersVerticalJacks}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersHorizontalBeamsFront && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dầm ngang trước</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersHorizontalBeamsFront}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersHorizontalBeamsRear && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dầm ngang sau</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersHorizontalBeamsRear}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggerSpan && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng chân chống</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggerSpan}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersFrontRetracted && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chân chống trước (thu)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersFrontRetracted}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersFrontExtension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chân chống trước (mở)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersFrontExtension}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersRearRetracted && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chân chống sau (thu)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersRearRetracted}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersRearExtension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chân chống sau (mở)</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.outriggersRearExtension}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* HỆ THỐNG THỦY LỰC (HYDRAULIC SYSTEM) */}
              <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-amber-500">Hệ thống thủy lực (Hydraulic System)</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.hydraulicPumpType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicPumpType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicOperatingPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất định mức</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicOperatingPressure}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicOilFlow && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng định mức</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicOilFlow}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicRatedRevolution && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ quay định mức</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicRatedRevolution}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicControlValve && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Van điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicControlValve}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicReliefValvePressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất van xả</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicReliefValvePressure}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicCounterBalanceValve && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Van cân bằng</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicCounterBalanceValve}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicPilotCheckValve && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Van kiểm tra pilot</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicPilotCheckValve}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicMotorHoisting && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Mô tơ nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicMotorHoisting}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicMotorSlewing && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Mô tơ xoay</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicMotorSlewing}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicCylinders && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Xi lanh thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicCylinders}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích thùng dầu</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicTankCapacity}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* THIẾT BỊ AN TOÀN (SAFETY DEVICES) */}
              {(truck.craneSpec.safetyFeatures || truck.craneSpec.safetySystem) && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-rose-500">Thiết bị an toàn (Safety Devices)</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-medium">{truck.craneSpec.safetyFeatures || truck.craneSpec.safetySystem}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

              {/* TÍNH NĂNG TÙY CHỌN (OPTIONAL FEATURES) */}
              {truck.craneSpec.optionalFeatures && truck.craneSpec.optionalFeatures.length > 0 && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-teal-500">Tính năng tùy chọn (Optional Features)</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.craneSpec.optionalFeatures.map((feature: string, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-3 font-medium">{index + 1}. {feature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* HỆ THỐNG ĐIỀU KHIỂN */}
              {truck.craneSpec.controlSystem && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-gray-500">Hệ thống điều khiển</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-medium">{truck.craneSpec.controlSystem}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

              {/* BẢNG TẢI TRỌNG (RATED LOAD CHART) */}
              {truck.craneSpec.ratedLoadChart && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-slate-500">Bảng tải trọng (Rated Load Chart) - Đơn vị: kgf</h4>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-2 border text-center text-gray-700" rowSpan={2}>Bán kính (m)</th>
                          <th className="py-2 px-2 border text-center text-gray-700" colSpan={truck.craneSpec.ratedLoadChart.boomLengths?.length || 4}>Chiều dài cần (Boom Length)</th>
                        </tr>
                        <tr className="bg-gray-100">
                          {truck.craneSpec.ratedLoadChart.boomLengths?.map((length: string, idx: number) => (
                            <th key={idx} className="py-2 px-2 border text-center text-gray-700">{length}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {truck.craneSpec.ratedLoadChart.data?.map((row: { radius: string; values: (string | null)[] }, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-2 px-2 border text-center font-medium bg-gray-50">{row.radius}</td>
                            {row.values.map((val: string | null, valIdx: number) => (
                              <td key={valIdx} className={`py-2 px-2 border text-center ${val ? '' : 'bg-gray-200'}`} style={{ whiteSpace: 'pre-line' }}>
                                {val || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">* Số trong ngoặc ( ) là bán kính làm việc</p>
                </>
              )}

              {/* CHI TIẾT TẢI TRỌNG (danh sách) */}
              {truck.craneSpec.detailedLiftingCapacity && truck.craneSpec.detailedLiftingCapacity.length > 0 && !truck.craneSpec.ratedLoadChart && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 text-gray-800 p-2 rounded mb-3 border-l-4 border-slate-500">Bảng tải trọng chi tiết (Rated Load)</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.craneSpec.detailedLiftingCapacity.map((item: string, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-3 border">{item}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Các thông số cũ cho tương thích ngược */}
              {(truck.craneSpec.hoistSpeed || truck.craneSpec.trolleySpeed || truck.craneSpec.counterweight) && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số khác</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.craneSpec.hoistSpeed && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ nâng</td>
                          <td className="py-2 px-3 font-medium">{truck.craneSpec.hoistSpeed}</td>
                        </tr>
                      )}
                      {truck.craneSpec.trolleySpeed && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ xe con</td>
                          <td className="py-2 px-3 font-medium">{truck.craneSpec.trolleySpeed}</td>
                        </tr>
                      )}
                      {truck.craneSpec.counterweight && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Đối trọng</td>
                          <td className="py-2 px-3 font-medium">{truck.craneSpec.counterweight}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}

          {truck.manBasketSpec && (
            <>
              <h4 className="font-bold text-lg bg-orange-100 p-2 rounded mb-3 text-orange-800">Thông số giỏ nâng người</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.manBasketSpec.model && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Model giỏ</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.manBasketSpec.model}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.size && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước giỏ</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.size}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.capacity && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600">Tải trọng giỏ</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.manBasketSpec.capacity}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.persons && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số người</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.persons}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.material && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.manBasketSpec.material}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.insulationRating && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Khả năng cách điện</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.manBasketSpec.insulationRating}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.insulationResistance && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Điện trở cách điện</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.insulationResistance}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.floor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sàn giỏ</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.floor}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.railing && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lan can</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.railing}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.safetyHook && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Điểm móc dây an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.manBasketSpec.safetyHook}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.weight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Trọng lượng giỏ</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.weight}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.connection && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kết nối với cẩu</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.connection}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.toolHolder && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Giá dụng cụ</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.toolHolder}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.certification && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Chứng nhận</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.manBasketSpec.certification}</td>
                    </tr>
                  )}
                  {truck.manBasketSpec.color && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Màu sắc</td>
                      <td className="py-2 px-3 font-medium">{truck.manBasketSpec.color}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.tankSpec && (
            <>
              <h4 className="font-bold text-lg bg-purple-100 p-2 rounded mb-3 text-purple-800">Thông số bồn xitec</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tankSpec.capacity && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.tankSpec.capacity}</td>
                    </tr>
                  )}
                  {truck.tankSpec.material && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu bồn</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.tankSpec.material}</td>
                    </tr>
                  )}
                  {truck.tankSpec.thickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày thành bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.thickness}</td>
                    </tr>
                  )}
                  {truck.tankSpec.tankDimension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.tankDimension}</td>
                    </tr>
                  )}
                  {truck.tankSpec.designPressure && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Áp suất thiết kế</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.tankSpec.designPressure}</td>
                    </tr>
                  )}
                  {truck.tankSpec.testPressure && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Áp suất thử</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.tankSpec.testPressure}</td>
                    </tr>
                  )}
                  {truck.tankSpec.workingTemperature && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Nhiệt độ làm việc</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.workingTemperature}</td>
                    </tr>
                  )}
                  {truck.tankSpec.baffles && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tấm chắn sóng</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.baffles}</td>
                    </tr>
                  )}
                  {truck.tankSpec.manholeSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đường kính lỗ đôm</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.manholeSize}</td>
                    </tr>
                  )}
                  {truck.tankSpec.pumpType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Loại bơm</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tankSpec.pumpType}</td>
                    </tr>
                  )}
                  {truck.tankSpec.pumpFlowRate && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Lưu lượng bơm</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tankSpec.pumpFlowRate}</td>
                    </tr>
                  )}
                  {truck.tankSpec.dischargePipe && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đường ống xả</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.dischargePipe}</td>
                    </tr>
                  )}
                  {truck.tankSpec.valveType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại van</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.valveType}</td>
                    </tr>
                  )}
                  {truck.tankSpec.flowMeter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đồng hồ đo lưu lượng</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.flowMeter}</td>
                    </tr>
                  )}
                  {truck.tankSpec.safetyFeatures && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.tankSpec.safetyFeatures}</td>
                    </tr>
                  )}
                  {truck.tankSpec.certifications && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tiêu chuẩn chứng nhận</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.tankSpec.certifications}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.glassRackSpec && (
            <>
              <h4 className="font-bold text-lg bg-sky-100 p-2 rounded mb-3 text-sky-800">Thông số giá chở kính chữ A</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.glassRackSpec.rackType && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại giá</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.glassRackSpec.rackType}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.rackDimension && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600">Kích thước giá</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.glassRackSpec.rackDimension}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.rackMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu khung</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.rackMaterial}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.surfaceFinish && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Xử lý bề mặt</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.surfaceFinish}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.rackAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc nghiêng giá</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.rackAngle}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.loadCapacityPerSide && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Tải trọng mỗi bên</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.glassRackSpec.loadCapacityPerSide}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.maxGlassSize && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Kích thước kính tối đa</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.glassRackSpec.maxGlassSize}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.paddingMaterial && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu lót đệm</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.glassRackSpec.paddingMaterial}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.separatorMaterial && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu ngăn cách</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.glassRackSpec.separatorMaterial}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.strapType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại dây đai</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.strapType}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.strapQuantity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số lượng dây đai</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.strapQuantity}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.tieDownPoints && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số điểm neo</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.tieDownPoints}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.crossBracing && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh giằng chéo</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.crossBracing}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.endStops && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh chắn đầu/cuối</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.endStops}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.certifications && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Chứng nhận</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.glassRackSpec.certifications}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.coolingBox && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số làm lạnh</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.coolingBox.temperatureRange && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phạm vi nhiệt độ</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.temperatureRange}</td>
                    </tr>
                  )}
                  {truck.coolingBox.coolingUnit && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đơn vị làm lạnh</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.coolingUnit}</td>
                    </tr>
                  )}
                  {truck.coolingBox.insulationThickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày cách nhiệt</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.insulationThickness}</td>
                    </tr>
                  )}
                  {truck.coolingBox.wallMaterials && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu vách</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.wallMaterials.join(', ')}</td>
                    </tr>
                  )}
                  {truck.coolingBox.doorType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cửa</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.doorType}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.insulatedBox && renderSpecTable(truck.insulatedBox, 'Thông số thùng bảo ôn')}
          {truck.closedBox && renderSpecTable(truck.closedBox, 'Thông số thùng kín')}
          {truck.tarpaulinBox && renderSpecTable(truck.tarpaulinBox, 'Thông số thùng bạt')}

          {truck.flatbedBox && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số thùng lửng</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.flatbedBox.floorMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.floorMaterial}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.floorThickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.floorThickness}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.sideHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao thành bên</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.sideHeight}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.sideType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại thành bên</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.sideType}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.sideAccess && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khả năng bốc dỡ</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.sideAccess}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.reinforcement && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Gia cường</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.reinforcement}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.tailLift && (
            <>
              <h4 className="font-bold text-lg bg-blue-100 p-2 rounded mb-3 text-blue-800">Thông số bửng nâng</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tailLift.type && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại bửng nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.type}</td>
                    </tr>
                  )}
                  {truck.tailLift.liftCapacity && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Sức nâng</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tailLift.liftCapacity}</td>
                    </tr>
                  )}
                  {truck.tailLift.platformSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước mặt bàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.platformSize}</td>
                    </tr>
                  )}
                  {truck.tailLift.liftHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.liftHeight}</td>
                    </tr>
                  )}
                  {truck.tailLift.powerSource && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Nguồn điện</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.powerSource}</td>
                    </tr>
                  )}
                  {truck.tailLift.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.controlSystem}</td>
                    </tr>
                  )}
                  {truck.tailLift.liftTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thời gian nâng/hạ</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.liftTime}</td>
                    </tr>
                  )}
                  {truck.tailLift.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.tailLift.hydraulicFluid && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dầu thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.hydraulicFluid}</td>
                    </tr>
                  )}
                  {truck.tailLift.safetyFeatures && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.tailLift.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.palletSystem && (
            <>
              <h4 className="font-bold text-lg bg-purple-100 p-2 rounded mb-3 text-purple-800">Hệ thống chở pallet</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.palletSystem.rollerSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống con lăn</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.rollerSystem}</td>
                    </tr>
                  )}
                  {truck.palletSystem.rollerMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu con lăn</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.rollerMaterial}</td>
                    </tr>
                  )}
                  {truck.palletSystem.palletCapacity && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600">Sức chứa pallet</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.palletSystem.palletCapacity}</td>
                    </tr>
                  )}
                  {truck.palletSystem.palletAnchors && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Móc neo pallet</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.palletAnchors}</td>
                    </tr>
                  )}
                  {truck.palletSystem.palletStops && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh chắn pallet</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.palletStops}</td>
                    </tr>
                  )}
                  {truck.palletSystem.antiStatic && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Chống tĩnh điện ESD</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.palletSystem.antiStatic}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.wingBoxSystem && (
            <>
              <h4 className="font-bold text-lg bg-orange-100 p-2 rounded mb-3 text-orange-800">Hệ thống cánh dơi</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.wingBoxSystem.wingType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại cánh</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.wingType}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.openingAngle && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600">Góc mở cánh</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.wingBoxSystem.openingAngle}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.hydraulicCylinder && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Xi lanh thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.hydraulicCylinder}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.controlSystem}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.openingTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thời gian mở/đóng</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.openingTime}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.safetyFeatures && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.wingBoxSystem.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.crateSystem && (
            <>
              <h4 className="font-bold text-lg bg-amber-100 p-2 rounded mb-3 text-amber-800">Hệ thống chở két chai</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.crateSystem.crateCapacity && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sức chứa két</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.crateSystem.crateCapacity}</td>
                    </tr>
                  )}
                  {truck.crateSystem.stackingHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao xếp</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.stackingHeight}</td>
                    </tr>
                  )}
                  {truck.crateSystem.antiSlipFloor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sàn chống trượt</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.antiSlipFloor}</td>
                    </tr>
                  )}
                  {truck.crateSystem.retainingBars && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh chắn giữ hàng</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.retainingBars}</td>
                    </tr>
                  )}
                  {truck.crateSystem.ventilation && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thông gió</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.ventilation}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.compactorSystem && (
            <>
              <h4 className="font-bold text-lg bg-green-100 p-2 rounded mb-3 text-green-800">Hệ thống cuốn ép rác</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.compactorSystem.compactorCapacity && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích thùng ép</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.compactorSystem.compactorCapacity}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.compressionRatio && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tỷ lệ ép</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.compressionRatio}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.maxPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất ép tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.maxPressure}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.leachateCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bồn chứa nước rác</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.leachateCapacity}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.controlSystem}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.safetyFeatures && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.compactorSystem.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.motorcycleCarrierSystem && (
            <>
              <h4 className="font-bold text-lg bg-red-100 p-2 rounded mb-3 text-red-800">Hệ thống chở mô tô xe máy</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.motorcycleCarrierSystem.deckLayout && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cấu trúc thùng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.deckLayout}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.deckDimensions && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước mỗi tầng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.deckDimensions}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.motorcycleCapacity && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Sức chứa xe máy</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.motorcycleCarrierSystem.motorcycleCapacity}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.liftCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bửng nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.liftCapacity}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.liftPlatformSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước mặt bửng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.liftPlatformSize}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.tieDownSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống chằng buộc</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.tieDownSystem}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.antiSlipFloor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sàn chống trượt</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.antiSlipFloor}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.drillingSystem && (
            <>
              <h4 className="font-bold text-lg bg-orange-100 p-2 rounded mb-3 text-orange-800">Thông số hệ thống khoan</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.drillingSystem.maxDiameter && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đường kính khoan tối đa</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.drillingSystem.maxDiameter}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.maxDepth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ sâu khoan tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.maxDepth}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.maxTorque && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600">Mô-men xoắn tối đa</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.drillingSystem.maxTorque}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.rotationSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ quay</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.rotationSpeed}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.crowdForce && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lực đẩy xuống</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.crowdForce}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.pullbackForce && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lực kéo lên</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.pullbackForce}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.kellyBarType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cần Kelly</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.kellyBarType}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.hydraulicPressure}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.feedStroke && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hành trình đẩy</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.feedStroke}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.ladderSystem && (
            <>
              <h4 className="font-bold text-lg bg-red-100 p-2 rounded mb-3 text-red-800">Hệ thống thang cứu hộ</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.ladderSystem.maxHeight && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng tối đa</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.ladderSystem.maxHeight}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.maxRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính làm việc</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.maxRadius}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.elevationAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc nâng thang</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.elevationAngle}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.rotationAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc quay thang</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.rotationAngle}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.ladderSections && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số đốt thang</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.ladderSections}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.basketCapacity && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Sức nâng giỏ</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.ladderSystem.basketCapacity}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.basketControls && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Điều khiển giỏ</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.basketControls}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.outriggerSpan && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khẩu độ chân chống</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.outriggerSpan}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.groundSlope && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ nghiêng mặt đất cho phép</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.groundSlope}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.hydraulicPressure}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.wireDispenserId && (
            <>
              <h4 className="font-bold text-lg bg-green-100 p-2 rounded mb-3 text-green-800">Hệ thống rải dây thép gai</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.wireDispenserId.deploymentSpeed && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ rải</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.wireDispenserId.deploymentSpeed}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.wireCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sức chứa cuộn dây</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.wireCapacity}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.wireTypes && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại dây tương thích</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.wireTypes}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.barrierLayers && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số lớp hàng rào</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.barrierLayers}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.barrierHeight && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Chiều cao hàng rào</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.wireDispenserId.barrierHeight}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.hydraulicWinches && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tời thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.hydraulicWinches}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.controlSystem}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.workLights && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đèn công tác</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.workLights}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.aerialPlatformSpec && (
            <>
              <h4 className="font-bold text-lg bg-cyan-100 p-2 rounded mb-3 text-cyan-800">Hệ thống nâng người</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.aerialPlatformSpec.maxPlatformHeight && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng sàn tối đa</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.maxPlatformHeight}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.workingHeight && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao làm việc</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.workingHeight}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.platformCapacity && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng sàn</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.platformCapacity}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.platformSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.platformSize}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.platformExtension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sàn mở rộng</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.platformExtension}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.horizontalReach && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tầm vươn ngang</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.horizontalReach}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.boomElevation && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kiểu nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.boomElevation}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.boomType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại thiết bị</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.boomType}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.slewing && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc quay</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.slewing}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.voltage && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Điện áp</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.aerialPlatformSpec.voltage}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.batteryCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung lượng pin</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.batteryCapacity}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.chargingTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian sạc</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.chargingTime}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.operatingTime && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian hoạt động</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.aerialPlatformSpec.operatingTime}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.hydraulicSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.hydraulicSystem}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.liftingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.liftingSpeed}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.loweringSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ hạ</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.loweringSpeed}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.driveSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống dẫn động</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.driveSystem}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.travelSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ di chuyển</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.travelSpeed}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.gradability && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng leo dốc</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.gradability}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.turningRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bán kính quay</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.turningRadius}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.tireType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại lốp</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.tireType}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.insulationRating && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cách điện</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.insulationRating}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.outriggerSpan && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khẩu độ chân chống</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.outriggerSpan}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.controlSystem}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.safetyFeatures && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.aerialPlatformSpec.safetyFeatures}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.operatingTemperature && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Nhiệt độ hoạt động</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.operatingTemperature}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.noiseLevel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Độ ồn</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.noiseLevel}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.certifications && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chứng nhận</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.aerialPlatformSpec.certifications}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Roller Spec - Thông số xe lu */}
          {truck.rollerSpec && (
            <>
              <h4 className="font-bold text-lg bg-amber-100 p-2 rounded mb-3 text-amber-800">Thông số hệ thống lu</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.rollerSpec.drumWidth && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng trống</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.rollerSpec.drumWidth}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.drumDiameter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đường kính trống</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.drumDiameter}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.drumWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Trọng lượng trống</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.drumWeight}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.centrifugalForce && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Lực li tâm</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.rollerSpec.centrifugalForce}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.frequency && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tần số rung</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.frequency}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.amplitude && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Biên độ rung</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.amplitude}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.staticLinearLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng tuyến tính</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.staticLinearLoad}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.compactionDepth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Độ sâu đầm nén</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.compactionDepth}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.numberOfWheels && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số lượng bánh</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.numberOfWheels}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.tireSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước lốp</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.tireSize}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.tirePressureRange && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất lốp</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.tirePressureRange}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.waterTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bình nước</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.waterTankCapacity}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.turningRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bán kính quay</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.turningRadius}</td>
                    </tr>
                  )}
                  {truck.rollerSpec.climbingAbility && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng leo dốc</td>
                      <td className="py-2 px-3 font-medium">{truck.rollerSpec.climbingAbility}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Compactor Spec - Thông số máy đầm */}
          {truck.compactorSpec && (
            <>
              <h4 className="font-bold text-lg bg-orange-100 p-2 rounded mb-3 text-orange-800">Thông số máy đầm</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.compactorSpec.compactorType && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại máy đầm</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.compactorSpec.compactorType}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.plateSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước bàn đầm</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSpec.plateSize}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.impactForce && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600">Lực đầm</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.compactorSpec.impactForce}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.frequency && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tần số đầm</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSpec.frequency}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.jumpingHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao nhảy</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSpec.jumpingHeight}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.compactionDepth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ sâu đầm nén</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSpec.compactionDepth}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.travelSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ di chuyển</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSpec.travelSpeed}</td>
                    </tr>
                  )}
                  {truck.compactorSpec.suitableSoil && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại đất phù hợp</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSpec.suitableSoil}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Generator Spec - Thông số máy phát điện */}
          {truck.generatorSpec && (
            <>
              <h4 className="font-bold text-lg bg-yellow-100 p-2 rounded mb-3 text-yellow-800">Thông số máy phát điện</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.generatorSpec.standbyPower && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất dự phòng</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.generatorSpec.standbyPower}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.primePower && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Công suất liên tục</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.generatorSpec.primePower}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.ratedVoltage && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Điện áp định mức</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.ratedVoltage}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.frequency && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tần số</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.frequency}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.phases && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số pha</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.phases}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.powerFactor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ số công suất</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.powerFactor}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.alternatorModel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Model đầu phát</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.alternatorModel}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.alternatorType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại đầu phát</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.alternatorType}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.fuelConsumption100 && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tiêu hao @ 100%</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.fuelConsumption100}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.fuelConsumption75 && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tiêu hao @ 75%</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.fuelConsumption75}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.controlPanel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bảng điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.controlPanel}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.noiseLevel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ ồn</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.noiseLevel}</td>
                    </tr>
                  )}
                  {truck.generatorSpec.atsCompatible && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">ATS tự động</td>
                      <td className="py-2 px-3 font-medium">{truck.generatorSpec.atsCompatible}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Compressor Spec - Thông số máy nén khí */}
          {truck.compressorSpec && (
            <>
              <h4 className="font-bold text-lg bg-sky-100 p-2 rounded mb-3 text-sky-800">Thông số máy nén khí</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.compressorSpec.compressorType && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại máy nén</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.compressorSpec.compressorType}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.freeAirDelivery && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600">Lưu lượng khí</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.compressorSpec.freeAirDelivery}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.normalPressure && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600">Áp suất làm việc</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.compressorSpec.normalPressure}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.maxPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.maxPressure}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.airOutletSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Cổng ra khí</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.airOutletSize}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.oilCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dung tích dầu</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.oilCapacity}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.fuelConsumption100 && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tiêu hao @ 100%</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.fuelConsumption100}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.runTimeAtFullTank && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thời gian chạy</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.runTimeAtFullTank}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.noiseLevel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ ồn</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.noiseLevel}</td>
                    </tr>
                  )}
                  {truck.compressorSpec.trailerType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại moóc</td>
                      <td className="py-2 px-3 font-medium">{truck.compressorSpec.trailerType}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Loader Spec - Thông số máy xúc lật */}
          {truck.loaderSpec && (
            <>
              <h4 className="font-bold text-lg bg-lime-100 p-2 rounded mb-3 text-lime-800">Thông số xúc lật</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.loaderSpec.bucketCapacity && (
                    <tr className="border-b bg-lime-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích gầu</td>
                      <td className="py-2 px-3 font-medium text-lime-700">{truck.loaderSpec.bucketCapacity}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.bucketWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều rộng gầu</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.bucketWidth}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.breakoutForce && (
                    <tr className="border-b bg-lime-50">
                      <td className="py-2 px-3 text-gray-600">Lực xúc</td>
                      <td className="py-2 px-3 font-medium text-lime-700">{truck.loaderSpec.breakoutForce}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.staticTippingLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng lật tĩnh</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.staticTippingLoad}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.maxLiftHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao nâng tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.maxLiftHeight}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.dumpHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao đổ</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.dumpHeight}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.dumpReach && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tầm đổ</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.dumpReach}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.liftCycleTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thời gian nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.liftCycleTime}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.hydraulicPumpFlow && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lưu lượng bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.hydraulicPumpFlow}</td>
                    </tr>
                  )}
                  {truck.loaderSpec.turningRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính quay</td>
                      <td className="py-2 px-3 font-medium">{truck.loaderSpec.turningRadius}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Excavator Spec - Thông số máy xúc đào */}
          {truck.excavatorSpec && (
            <>
              <h4 className="font-bold text-lg bg-yellow-100 p-2 rounded mb-3 text-yellow-800">Thông số xúc đào</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.excavatorSpec.bucketCapacity && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích gầu</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.excavatorSpec.bucketCapacity}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.maxDiggingDepth && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Chiều sâu đào tối đa</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.excavatorSpec.maxDiggingDepth}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.maxReach && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tầm với tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.maxReach}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.maxDumpHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao đổ</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.maxDumpHeight}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.bucketBreakoutForce && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Lực đào gầu</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.excavatorSpec.bucketBreakoutForce}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.armBreakoutForce && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lực đào tay gầu</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.armBreakoutForce}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.swingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ quay</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.swingSpeed}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.boomLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều dài cần</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.boomLength}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.armLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều dài tay gầu</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.armLength}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.hydraulicPumpFlow && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lưu lượng bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.hydraulicPumpFlow}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.hydraulicPressure}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Bulldozer Spec - Thông số máy ủi */}
          {truck.bulldozerSpec && (
            <>
              <h4 className="font-bold text-lg bg-stone-100 p-2 rounded mb-3 text-stone-800">Thông số máy ủi</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.bulldozerSpec.bladeType && (
                    <tr className="border-b bg-stone-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại lưỡi</td>
                      <td className="py-2 px-3 font-medium text-stone-700">{truck.bulldozerSpec.bladeType}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.bladeCapacity && (
                    <tr className="border-b bg-stone-50">
                      <td className="py-2 px-3 text-gray-600">Dung tích lưỡi</td>
                      <td className="py-2 px-3 font-medium text-stone-700">{truck.bulldozerSpec.bladeCapacity}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.bladeWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều rộng lưỡi</td>
                      <td className="py-2 px-3 font-medium">{truck.bulldozerSpec.bladeWidth}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.bladeHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao lưỡi</td>
                      <td className="py-2 px-3 font-medium">{truck.bulldozerSpec.bladeHeight}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.drawbarPull && (
                    <tr className="border-b bg-stone-50">
                      <td className="py-2 px-3 text-gray-600">Lực kéo</td>
                      <td className="py-2 px-3 font-medium text-stone-700">{truck.bulldozerSpec.drawbarPull}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.trackShoeWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều rộng guốc xích</td>
                      <td className="py-2 px-3 font-medium">{truck.bulldozerSpec.trackShoeWidth}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.trackGauge && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khoảng cách xích</td>
                      <td className="py-2 px-3 font-medium">{truck.bulldozerSpec.trackGauge}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.groundPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất lên đất</td>
                      <td className="py-2 px-3 font-medium">{truck.bulldozerSpec.groundPressure}</td>
                    </tr>
                  )}
                  {truck.bulldozerSpec.ripperType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại ripper</td>
                      <td className="py-2 px-3 font-medium">{truck.bulldozerSpec.ripperType}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Grader Spec - Thông số máy san */}
          {truck.graderSpec && (
            <>
              <h4 className="font-bold text-lg bg-teal-100 p-2 rounded mb-3 text-teal-800">Thông số máy san</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.graderSpec.bladeWidth && (
                    <tr className="border-b bg-teal-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng lưỡi san</td>
                      <td className="py-2 px-3 font-medium text-teal-700">{truck.graderSpec.bladeWidth}</td>
                    </tr>
                  )}
                  {truck.graderSpec.bladeHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao lưỡi san</td>
                      <td className="py-2 px-3 font-medium">{truck.graderSpec.bladeHeight}</td>
                    </tr>
                  )}
                  {truck.graderSpec.circleRotation && (
                    <tr className="border-b bg-teal-50">
                      <td className="py-2 px-3 text-gray-600">Góc quay lưỡi</td>
                      <td className="py-2 px-3 font-medium text-teal-700">{truck.graderSpec.circleRotation}</td>
                    </tr>
                  )}
                  {truck.graderSpec.bladeTiltAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc nghiêng lưỡi</td>
                      <td className="py-2 px-3 font-medium">{truck.graderSpec.bladeTiltAngle}</td>
                    </tr>
                  )}
                  {truck.graderSpec.bladeSideshift && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dịch ngang lưỡi</td>
                      <td className="py-2 px-3 font-medium">{truck.graderSpec.bladeSideshift}</td>
                    </tr>
                  )}
                  {truck.graderSpec.articulationAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc khớp nối</td>
                      <td className="py-2 px-3 font-medium">{truck.graderSpec.articulationAngle}</td>
                    </tr>
                  )}
                  {truck.graderSpec.leanAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc nghiêng bánh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.graderSpec.leanAngle}</td>
                    </tr>
                  )}
                  {truck.graderSpec.turningRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính quay</td>
                      <td className="py-2 px-3 font-medium">{truck.graderSpec.turningRadius}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Concrete Mixer Spec - Thông số máy trộn bê tông tự hành */}
          {truck.concreteMixerSpec && (
            <>
              <h4 className="font-bold text-lg bg-slate-100 p-2 rounded mb-3 text-slate-800">Thông số máy trộn bê tông</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.concreteMixerSpec.mixerCapacity && (
                    <tr className="border-b bg-slate-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích thùng trộn</td>
                      <td className="py-2 px-3 font-medium text-slate-700">{truck.concreteMixerSpec.mixerCapacity}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.outputPerBatch && (
                    <tr className="border-b bg-slate-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sản lượng mỗi mẻ</td>
                      <td className="py-2 px-3 font-medium text-slate-700">{truck.concreteMixerSpec.outputPerBatch}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.bucketCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích gầu xúc</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.bucketCapacity}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.waterTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn nước</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.waterTankCapacity}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.mixingTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian trộn</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.mixingTime}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.weighingSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống cân</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.weighingSystem}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.wheelDrive && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống dẫn động</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.wheelDrive}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.maxTransportSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ di chuyển</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.maxTransportSpeed}</td>
                    </tr>
                  )}
                  {truck.concreteMixerSpec.gradability && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng leo dốc</td>
                      <td className="py-2 px-3 font-medium">{truck.concreteMixerSpec.gradability}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Batching Plant Spec - Thông số trạm trộn bê tông */}
          {truck.batchingPlantSpec && (
            <>
              <h4 className="font-bold text-lg bg-zinc-100 p-2 rounded mb-3 text-zinc-800">Thông số trạm trộn</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.batchingPlantSpec.theoreticalOutput && (
                    <tr className="border-b bg-zinc-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất lý thuyết</td>
                      <td className="py-2 px-3 font-medium text-zinc-700">{truck.batchingPlantSpec.theoreticalOutput}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.mixerType && (
                    <tr className="border-b bg-zinc-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại máy trộn</td>
                      <td className="py-2 px-3 font-medium text-zinc-700">{truck.batchingPlantSpec.mixerType}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.mixerCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích máy trộn</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.mixerCapacity}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.aggregateBins && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số phễu cốt liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.aggregateBins}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.cementSiloCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích silo xi măng</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.cementSiloCapacity}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.conveyorWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng băng tải</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.conveyorWidth}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.weighingSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống cân</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.weighingSystem}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.controlSystem}</td>
                    </tr>
                  )}
                  {truck.batchingPlantSpec.totalPower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tổng công suất điện</td>
                      <td className="py-2 px-3 font-medium">{truck.batchingPlantSpec.totalPower}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Concrete Pump Spec - Thông số máy bơm bê tông */}
          {truck.concretePumpSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3 text-gray-800">Thông số máy bơm bê tông</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.concretePumpSpec.theoreticalOutput && (
                    <tr className="border-b bg-gray-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất lý thuyết</td>
                      <td className="py-2 px-3 font-medium text-gray-700">{truck.concretePumpSpec.theoreticalOutput}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.maxPressure && (
                    <tr className="border-b bg-gray-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất tối đa</td>
                      <td className="py-2 px-3 font-medium text-gray-700">{truck.concretePumpSpec.maxPressure}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.cylinderDiameter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đường kính xi lanh</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.cylinderDiameter}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.pistonStroke && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hành trình piston</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.pistonStroke}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.pipelineDiameter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đường kính ống bơm</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.pipelineDiameter}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.horizontalDistance && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cự ly bơm ngang</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.horizontalDistance}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.verticalDistance && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cự ly bơm đứng</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.verticalDistance}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.hopperCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích phễu</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.hopperCapacity}</td>
                    </tr>
                  )}
                  {truck.concretePumpSpec.remoteControl && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Điều khiển từ xa</td>
                      <td className="py-2 px-3 font-medium">{truck.concretePumpSpec.remoteControl}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Hoist Spec - Thông số palang điện */}
          {truck.hoistSpec && (
            <>
              <h4 className="font-bold text-lg bg-neutral-100 p-2 rounded mb-3 text-neutral-800">Thông số palang điện</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.hoistSpec.liftCapacity && (
                    <tr className="border-b bg-neutral-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng nâng</td>
                      <td className="py-2 px-3 font-medium text-neutral-700">{truck.hoistSpec.liftCapacity}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.liftHeight && (
                    <tr className="border-b bg-neutral-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng</td>
                      <td className="py-2 px-3 font-medium text-neutral-700">{truck.hoistSpec.liftHeight}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.liftSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.liftSpeed}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.liftMotorPower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất động cơ nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.liftMotorPower}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.hoistType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại palang</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.hoistType}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.brakeType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại phanh</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.brakeType}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.voltage && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Điện áp</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.voltage}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.dutyClass && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cấp chế độ làm việc</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.dutyClass}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.controlType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.controlType}</td>
                    </tr>
                  )}
                  {truck.hoistSpec.safetyFeatures && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium">{truck.hoistSpec.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.vacuumSystem && (
            <>
              <h4 className="font-bold text-lg bg-amber-100 p-2 rounded mb-3 text-amber-800">Hệ thống hút chân không</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.vacuumSystem.tankCapacity && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.tankCapacity}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.vacuumLevel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Độ chân không</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.vacuumLevel}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.airFlowRate && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng khí</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.airFlowRate}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.vacuumPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bơm chân không</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.vacuumPump}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.pumpDrive && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dẫn động bơm</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.pumpDrive}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterType && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại lọc</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.filterType}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterStages && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số tầng lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.filterStages}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterArea && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Diện tích lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.filterArea}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterCleaning && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Làm sạch lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.filterCleaning}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.tankMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.tankMaterial}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.tankDimensions && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.tankDimensions}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.suctionDistance && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khoảng cách hút</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.suctionDistance}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.fillTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian hút đầy</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.fillTime}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.blowbackPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất đẩy ngược</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.blowbackPressure}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.dischargeDoor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cửa xả</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.dischargeDoor}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.liftingAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nâng bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.liftingAngle}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.suctionHose && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Ống hút</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.suctionHose}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.hoseReel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tời cuộn ống</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.hoseReel}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số xe nâng đầu chở máy công trình */}
          {truck.tiltDeckSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số sàn nâng đầu</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tiltDeckSpec.deckLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều dài sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.deckLength}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.deckWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.deckWidth}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.deckCapacity && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng sàn</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tiltDeckSpec.deckCapacity}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.deckMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.deckMaterial}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.deckFrame && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khung sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.deckFrame}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.tiltAngle && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nâng đầu</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.tiltDeckSpec.tiltAngle}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.tiltCylinder && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Xi lanh nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.tiltCylinder}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.hydraulicPressure}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.hydraulicPump}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Cầu lên & Tời kéo</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tiltDeckSpec.rampLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều dài cầu lên</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.rampLength}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.rampWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng cầu lên</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.rampWidth}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.rampCapacity && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng cầu lên</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tiltDeckSpec.rampCapacity}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.rampAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nghiêng cầu</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.rampAngle}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.winchCapacity && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lực kéo tời</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.tiltDeckSpec.winchCapacity}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.winchCableSpec && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cáp tời</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.winchCableSpec}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.winchSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ kéo</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.winchSpeed}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.winchControl && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Điều khiển tời</td>
                      <td className="py-2 px-3 font-medium">{truck.tiltDeckSpec.winchControl}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.tieDownPoints && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chốt neo cố định</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.tiltDeckSpec.tieDownPoints}</td>
                    </tr>
                  )}
                  {truck.tiltDeckSpec.safetyFeatures && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.tiltDeckSpec.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số xe quét rửa đường */}
          {truck.streetSweeperSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Bồn chứa rác & nước</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.streetSweeperSpec.garbageTankCapacity && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn rác</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.streetSweeperSpec.garbageTankCapacity}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.waterTankCapacity && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn nước</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.streetSweeperSpec.waterTankCapacity}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.tankMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.tankMaterial}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.dumpingSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống xả rác</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.dumpingSystem}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống chổi quét</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.streetSweeperSpec.mainBrushDiameter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chổi chính</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.mainBrushDiameter}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.sideBrushDiameter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chổi bên</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.sideBrushDiameter}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.sweepingWidth && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng quét</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.streetSweeperSpec.sweepingWidth}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.brushDrive && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dẫn động chổi</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.brushDrive}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.brushPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp lực chổi</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.brushPressure}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống hút chân không</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.streetSweeperSpec.vacuumPumpType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại bơm hút</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.vacuumPumpType}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.vacuumAirFlow && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng hút</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.streetSweeperSpec.vacuumAirFlow}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.vacuumLevel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Độ chân không</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.vacuumLevel}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.suctionNozzleWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Miệng hút</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.suctionNozzleWidth}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.filterSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.filterSystem}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.filterCleaning && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Làm sạch bộ lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.filterCleaning}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống phun nước</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.streetSweeperSpec.dustSprayPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phun dập bụi</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.dustSprayPressure}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.dustSprayFlow && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng phun</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.dustSprayFlow}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.highPressurePump && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bơm áp lực cao</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.streetSweeperSpec.highPressurePump}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.highPressureFlow && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng cao áp</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.highPressureFlow}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.sprayGunHoseLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Súng phun tay</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.sprayGunHoseLength}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.waterPumpType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bơm cấp nước</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.waterPumpType}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hiệu suất & Điều khiển</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.streetSweeperSpec.sweepingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ quét</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.sweepingSpeed}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.sweepingProductivity && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Năng suất quét</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.streetSweeperSpec.sweepingProductivity}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.streetSweeperSpec.controlSystem}</td>
                    </tr>
                  )}
                  {truck.streetSweeperSpec.safetyFeatures && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.streetSweeperSpec.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số xe arm roll hook lift */}
          {truck.armRollSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thùng rời</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.armRollSpec.binCapacity && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích thùng</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.armRollSpec.binCapacity}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.binDimension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước thùng</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.binDimension}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.binMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu thùng</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.binMaterial}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.binFloor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đáy thùng</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.binFloor}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.hookType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Móc hook</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.hookType}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Cánh tay Arm Roll</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.armRollSpec.armFrame && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khung cánh tay</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.armFrame}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.pivotShaft && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Trục bản lề</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.pivotShaft}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.tailRoller && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Con lăn đuôi</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.tailRoller}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.liftAngle && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nâng</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.armRollSpec.liftAngle}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.tiltAngle && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nghiêng (đổ)</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.armRollSpec.tiltAngle}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.binLock && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khóa thùng</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.binLock}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống thủy lực</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.armRollSpec.cylinderCount && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số xi lanh</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.cylinderCount}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.cylinderDimension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước xi lanh</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.cylinderDimension}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.hydraulicPressure && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.armRollSpec.hydraulicPressure}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.liftingForce && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lực nâng</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.armRollSpec.liftingForce}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.cylinderOrigin && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Xuất xứ xi lanh</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.cylinderOrigin}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.oilTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thùng dầu</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.oilTankCapacity}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.safetyValve && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Van an toàn</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.armRollSpec.safetyValve}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hiệu suất & Điều khiển</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.armRollSpec.liftingTime && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian nâng</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.armRollSpec.liftingTime}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.loweringTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian hạ</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.loweringTime}</td>
                    </tr>
                  )}
                  {truck.armRollSpec.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.armRollSpec.controlSystem}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số xe chữa cháy cứu hỏa */}
          {truck.fireFightingSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Bồn chứa nước & Foam</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.fireFightingSpec.waterTankCapacity && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn nước</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.fireFightingSpec.waterTankCapacity}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.waterTankMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu bồn nước</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.waterTankMaterial}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.foamTankCapacity && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn foam</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.fireFightingSpec.foamTankCapacity}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.foamType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại foam</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.foamType}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.foamMixingSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống trộn foam</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.foamMixingSystem}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống bơm chữa cháy</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.fireFightingSpec.pumpType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại bơm</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.pumpType}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.pumpFlowRate && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng bơm</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.fireFightingSpec.pumpFlowRate}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.pumpPressure && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất bơm</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.fireFightingSpec.pumpPressure}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.pumpDrive && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dẫn động</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.pumpDrive}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.suctionDepth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Độ sâu hút</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.suctionDepth}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống phun & Vòi</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.fireFightingSpec.monitorGun && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Súng monitor</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.fireFightingSpec.monitorGun}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.monitorRange && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tầm phun</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.monitorRange}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.dischargeOutlets && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cửa xả</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.dischargeOutlets}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.hosereels && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cuộn vòi nhanh</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.hosereels}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.fireHoseD65 && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vòi D65</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.fireHoseD65}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.nozzleTypeA && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lăng phun A</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.nozzleTypeA}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thiết bị cứu nạn</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.fireFightingSpec.ladder3Section && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thang 3 đoạn</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.ladder3Section}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.hookLadder && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thang móc</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.hookLadder}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.fireProofSuit && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Quần áo chống cháy</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.fireFightingSpec.fireProofSuit}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.scbaSet && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bình thở SCBA</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.fireFightingSpec.scbaSet}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.lightTower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cột đèn</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.lightTower}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.siren && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Còi hú</td>
                      <td className="py-2 px-3 font-medium">{truck.fireFightingSpec.siren}</td>
                    </tr>
                  )}
                  {truck.fireFightingSpec.certifications && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tiêu chuẩn</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.fireFightingSpec.certifications}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số xe bồn nhựa đường nóng */}
          {truck.bitumenTankSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Bồn chứa nhựa đường</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.bitumenTankSpec.capacity && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.bitumenTankSpec.capacity}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.tankDimension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.tankDimension}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.innerMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu bồn trong</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.innerMaterial}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.insulationMaterial && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu bảo ôn</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.bitumenTankSpec.insulationMaterial}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.workingTemperature && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Nhiệt độ làm việc</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.bitumenTankSpec.workingTemperature}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.heatRetention && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng giữ nhiệt</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.heatRetention}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống gia nhiệt</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.bitumenTankSpec.heatingType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại gia nhiệt</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.heatingType}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.burnerType && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lò đốt</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.bitumenTankSpec.burnerType}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.burnerPower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất lò đốt</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.burnerPower}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.heatTransferOil && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dầu tải nhiệt</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.heatTransferOil}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.heatingCoil && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Ống xoắn gia nhiệt</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.heatingCoil}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Bơm & Giàn phun</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.bitumenTankSpec.bitumenPumpType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại bơm</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.bitumenTankSpec.bitumenPumpType}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.pumpFlowRate && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng bơm</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.bitumenTankSpec.pumpFlowRate}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.sprayBarWidth && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng giàn phun</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.bitumenTankSpec.sprayBarWidth}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.nozzleCount && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số vòi phun</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.nozzleCount}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.sprayDensity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Mật độ phun</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.sprayDensity}</td>
                    </tr>
                  )}
                  {truck.bitumenTankSpec.handSprayGun && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Súng phun tay</td>
                      <td className="py-2 px-3 font-medium">{truck.bitumenTankSpec.handSprayGun}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số máy xúc đào */}
          {truck.excavatorSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hiệu suất đào</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.excavatorSpec.bucketCapacity && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích gầu</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.excavatorSpec.bucketCapacity}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.maxDigDepth && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều sâu đào tối đa</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.excavatorSpec.maxDigDepth}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.maxReach && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tầm với tối đa</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.excavatorSpec.maxReach}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.maxDigHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao đào tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.maxDigHeight}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.bucketDiggingForce && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lực đào gầu</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.excavatorSpec.bucketDiggingForce}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.armDiggingForce && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lực đào tay cần</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.armDiggingForce}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.swingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ quay toa</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.swingSpeed}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Bộ công tác & Di chuyển</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.excavatorSpec.boomLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều dài cần (Boom)</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.boomLength}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.armLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều dài tay cần (Arm)</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.armLength}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.trackShoeWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng xích</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.trackShoeWidth}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.travelSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ di chuyển</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.travelSpeed}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.groundPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất mặt đất</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.groundPressure}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống thủy lực</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.excavatorSpec.hydraulicFlowRate && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng thủy lực</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.excavatorSpec.hydraulicFlowRate}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.hydraulicPressure}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.workModes && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chế độ làm việc</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.excavatorSpec.workModes}</td>
                    </tr>
                  )}
                  {truck.excavatorSpec.fuelTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bình nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.excavatorSpec.fuelTankCapacity}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số xe nâng hàng */}
          {truck.forkliftSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hiệu suất nâng hạ</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {/* Tải trọng: liftCapacity hoặc loadCapacity */}
                  {(truck.forkliftSpec.liftCapacity || truck.forkliftSpec.loadCapacity) && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng nâng</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.forkliftSpec.liftCapacity || truck.forkliftSpec.loadCapacity}</td>
                    </tr>
                  )}
                  {/* Chiều cao nâng: maxLiftHeight hoặc liftHeight */}
                  {(truck.forkliftSpec.maxLiftHeight || truck.forkliftSpec.liftHeight) && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.forkliftSpec.maxLiftHeight || truck.forkliftSpec.liftHeight}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.loadCenter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tâm tải</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.loadCenter}</td>
                    </tr>
                  )}
                  {/* Chiều cao tự do: freeLift hoặc freeLifHeight */}
                  {(truck.forkliftSpec.freeLift || truck.forkliftSpec.freeLifHeight) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao tự do</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.freeLift || truck.forkliftSpec.freeLifHeight}</td>
                    </tr>
                  )}
                  {/* Kích thước càng: forkLength hoặc forkDimensions */}
                  {(truck.forkliftSpec.forkLength || truck.forkliftSpec.forkDimensions) && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước càng</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.forkLength || truck.forkliftSpec.forkDimensions}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.mastType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại khung nâng</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.forkliftSpec.mastType}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.tiltAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nghiêng</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.tiltAngle}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.motorType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại động cơ</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.motorType}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.batterySpec && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thông số pin</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.forkliftSpec.batterySpec}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.liftSpeedLoaded && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ nâng có tải</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.liftSpeedLoaded}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Di chuyển & Vận hành</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.forkliftSpec.transmission && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.transmission}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.steeringType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại lái</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.steeringType}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.tireType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại lốp</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.tireType}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.travelSpeedLoaded && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ di chuyển có tải</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.travelSpeedLoaded}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.gradability && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng leo dốc</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.gradability}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.turningRadius && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bán kính quay</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.forkliftSpec.turningRadius}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.aisleWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều rộng lối đi</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.aisleWidth}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.fuelConsumption && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tiêu hao nhiên liệu</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.forkliftSpec.fuelConsumption}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.counterweight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đối trọng</td>
                      <td className="py-2 px-3 font-medium">{truck.forkliftSpec.counterweight}</td>
                    </tr>
                  )}
                  {truck.forkliftSpec.safetySystem && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống an toàn</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.forkliftSpec.safetySystem}</td>
                    </tr>
                  )}
                </tbody>
              </table>

            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="contact" className="p-6 bg-white border-x border-b mt-0">
        <ContactForm productName={truck.name} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetailTabs;
