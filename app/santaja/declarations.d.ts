// declarations.d.ts
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.geojson' {
  const value: any
  export default value
}
declare module '@react-native-picker/picker' {
  import * as React from 'react';
  import { ViewProps, TextStyle } from 'react-native';

  export interface PickerProps extends ViewProps {
    selectedValue?: any;
    onValueChange?: (itemValue: any, itemIndex: number) => void;
    mode?: 'dialog' | 'dropdown';
    enabled?: boolean;
    prompt?: string;
    style?: any;
    itemStyle?: TextStyle;
    testID?: string;
  }

  export class Picker extends React.Component<PickerProps> {
    static Item: React.ComponentType<{
      label: string;
      value: any;
      color?: string;
      testID?: string;
    }>;
  }
}