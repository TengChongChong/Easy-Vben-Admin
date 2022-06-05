import type { App } from 'vue';
// import { Button } from './Button';
import {
  Alert,
  Avatar,
  Button,
  Layout,
  Card,
  Cascader,
  Divider,
  Dropdown,
  Tag,
  Tree,
  Tooltip,
  Popconfirm,
  Input,
  Radio,
  Row,
  Select,
  Col,
} from 'ant-design-vue';

export function registerGlobComp(app: App) {
  app
    .use(Alert)
    .use(Avatar)
    .use(Button)
    .use(Layout)
    .use(Card)
    .use(Cascader)
    .use(Divider)
    .use(Dropdown)
    .use(Tag)
    .use(Tree)
    .use(Tooltip)
    .use(Popconfirm)
    .use(Input)
    .use(Radio)
    .use(Row)
    .use(Select)
    .use(Col);
}
