import type { App } from 'vue';
// import { Button } from './Button';
import {
  Button,
  Layout,
  Card,
  Divider,
  Dropdown,
  Tag,
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
    .use(Button)
    .use(Layout)
    .use(Card)
    .use(Divider)
    .use(Dropdown)
    .use(Tag)
    .use(Tooltip)
    .use(Popconfirm)
    .use(Input)
    .use(Radio)
    .use(Row)
    .use(Select)
    .use(Col);
}
