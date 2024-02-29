import type { ColorPickerProps, GetProp } from 'antd';
import { Col, ColorPicker, Row } from 'antd';

type Color = GetProp<ColorPickerProps, 'value'>;

interface ColorPickerWithPresetsProps {
  defaultValue: string;
  onChange: (newColor: Color) => void;
}

const ColorPickerWithPresets: React.FC<ColorPickerWithPresetsProps> = ({ defaultValue, onChange }) => {
  const presets = {
    primary: ["rgb(255, 226, 143)", "#40a9ff", "#69c0ff", "#91d5ff", "#bae7ff", "#e6f7ff", "#f0f5ff", "#f5f5f5"],
  };

  const genPresets = () => {
    return Object.entries(presets).map(([label, colors]) => ({ label, colors }));
  };

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Presets } },
  ) => (
    <Row justify="space-between" wrap={false}>
      <Col span={24}>
        <Presets />
      </Col>
    </Row>
  );

  return (
    <ColorPicker defaultValue={defaultValue} presets={genPresets()} onChange={onChange} panelRender={customPanelRender} />
  );
};

export default ColorPickerWithPresets;