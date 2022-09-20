import type { Component } from 'vue';
import type { ComponentType } from './types';

/**
 * Component list, register here to setting it in the form
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Slider,
  Rate,
  Divider,
} from 'ant-design-vue';

import ApiRadioGroup from './components/ApiRadioGroup.vue';
import RadioButtonGroup from './components/RadioButtonGroup.vue';
import ApiSelect from './components/ApiSelect.vue';
import ApiTree from './components/ApiTree.vue';
import ApiTreeSelect from './components/ApiTreeSelect.vue';
import ApiCascader from './components/ApiCascader.vue';
import DictCascader from './components/DictCascader.vue';
import DictSelect from './components/DictSelect.vue';
import DictTreeSelect from './components/DictTreeSelect.vue';
import DictRadio from './components/DictRadio.vue';
import DictCheckbox from './components/DictCheckbox.vue';
import { UserSelect, UserModalSelect } from '/@/components/UserSelect';
import { DeptSelect } from '/@/components/Dept';
import { RoleSelect } from '/@/components/Role';
import { BasicUpload } from '/@/components/Upload';
import { StrengthMeter } from '/@/components/StrengthMeter';
import { IconPicker } from '/@/components/Icon';
import { CountdownInput } from '/@/components/CountDown';
import { AreaCascader } from '/@/components/AreaCascader';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputGroup', Input.Group);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', InputNumber);
componentMap.set('AutoComplete', AutoComplete);

componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('ApiTree', ApiTree);
componentMap.set('TreeSelect', TreeSelect);
componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('Switch', Switch);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('ApiCascader', ApiCascader);
componentMap.set('Cascader', Cascader);
componentMap.set('Slider', Slider);
componentMap.set('Rate', Rate);

componentMap.set('DatePicker', DatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('StrengthMeter', StrengthMeter);
componentMap.set('IconPicker', IconPicker);
componentMap.set('InputCountDown', CountdownInput);

componentMap.set('Divider', Divider);
// 字典
componentMap.set('DictCascader', DictCascader);
componentMap.set('DictSelect', DictSelect);
componentMap.set('DictTreeSelect', DictTreeSelect);
componentMap.set('DictRadio', DictRadio);
componentMap.set('DictCheckbox', DictCheckbox);
// 部门选择器
componentMap.set('DeptSelect', DeptSelect);
// 角色选择器
componentMap.set('RoleSelect', RoleSelect);
// 用户选择器
componentMap.set('UserSelect', UserSelect);
componentMap.set('UserModalSelect', UserModalSelect);
// 文件上传
componentMap.set('Upload', BasicUpload);
// 行政区划
componentMap.set('AreaCascader', AreaCascader);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
