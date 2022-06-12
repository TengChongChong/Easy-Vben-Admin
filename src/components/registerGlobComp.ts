import type { App } from 'vue';
// import { Button } from './Button';
import {
  Alert,
  Avatar,
  Button,
  Descriptions,
  Layout,
  List,
  Card,
  Cascader,
  Divider,
  Dropdown,
  Menu,
  Tag,
  Tree,
  Tooltip,
  Typography,
  Popconfirm,
  Input,
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
    .use(Descriptions)
    .use(Layout)
    .use(List)
    .use(Card)
    .use(Cascader)
    .use(Divider)
    .use(Dropdown)
    .use(Menu)
    .use(Tag)
    .use(Tree)
    .use(Tooltip)
    .use(Typography)
    .use(Popconfirm)
    .use(Input)
    .use(Radio)
    .use(Row)
    .use(Result)
    .use(Select)
    .use(Spin)
    .use(Col);
}
