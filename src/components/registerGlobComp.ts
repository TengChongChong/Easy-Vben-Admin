import type { App } from 'vue';

import {
  Alert,
  Avatar,
  Button,
  Badge,
  Checkbox,
  Descriptions,
  Layout,
  List,
  Card,
  Cascader,
  Divider,
  Dropdown,
  Menu,
  Table,
  Tabs,
  Tag,
  Tree,
  Tooltip,
  Typography,
  Popconfirm,
  Popover,
  Input,
  InputNumber,
  Upload,
  Radio,
  Row,
  Result,
  Select,
  Spin,
  Col,
} from 'ant-design-vue';

export function registerGlobComp(app: App) {
  app
    .use(Alert)
    .use(Avatar)
    .use(Button)
    .use(Badge)
    .use(Descriptions)
    .use(Layout)
    .use(List)
    .use(Card)
    .use(Cascader)
    .use(Checkbox)
    .use(Divider)
    .use(Dropdown)
    .use(Menu)
    .use(Table)
    .use(Tabs)
    .use(Tag)
    .use(Tree)
    .use(Tooltip)
    .use(Typography)
    .use(Popconfirm)
    .use(Popover)
    .use(Input)
    .use(InputNumber)
    .use(Upload)
    .use(Radio)
    .use(Row)
    .use(Result)
    .use(Select)
    .use(Spin)
    .use(Col);
}
