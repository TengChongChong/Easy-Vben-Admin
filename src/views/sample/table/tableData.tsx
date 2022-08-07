import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: true,
      width: 160,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      sorter: true,
      width: 150,
      format: 'dict|sex',
      filters: 'dict|sex',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      sorter: true,
      width: 160,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      sorter: true,
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      width: 150,
      format: 'dict|commonStatus',
      filters: 'dict|commonStatus',
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      width: 220,
    },
    {
      title: '编辑人',
      dataIndex: 'editUser',
      sorter: true,
      width: 160,
    },
    {
      title: '编辑时间',
      dataIndex: 'editDate',
      sorter: true,
      width: 160,
      format: 'date|YYYY-MM-DD HH:mm',
    },
  ];
}

export function getBasicShortColumns(): BasicColumn[] {
  return [
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: true,
      width: 160,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      sorter: true,
      width: 150,
      format: 'dict|sex',
      filters: 'dict|sex',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      sorter: true,
      width: 160,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      sorter: true,
      width: 160,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      width: 150,
      format: 'dict|commonStatus',
      filters: 'dict|commonStatus',
    },
  ];
}

export function getMultipleHeaderColumns(): BasicColumn[] {
  return [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      sorter: true,
      width: 150,
      format: 'dict|sex',
      filters: 'dict|sex',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      sorter: true,
      width: 160,
    },
    {
      title: '其他',
      dataIndex: 'other',
      children: [
        {
          title: '手机号码',
          dataIndex: 'phone',
          sorter: true,
          width: 160,
        },
        {
          title: '地址',
          dataIndex: 'address',
          sorter: true,
          width: 220,
        },
      ],
    },
  ];
}

export function getCustomHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      width: 120,
      // slots: { title: 'customTitle' },
    },
    {
      // title: '地址',
      dataIndex: 'address',
      width: 120,
      // slots: { title: 'customAddress' },
      sorter: true,
    },

    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 120,
    },
  ];
}

export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: any = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
    });
  }
  return arr;
};
export function getFormConfig(): Partial<FormProps> {
  return {
    schemas: [
      {
        field: 'name',
        label: '姓名',
        component: 'Input',
      },
      {
        field: 'phone',
        label: '手机号码',
        component: 'Input',
      },
      {
        field: 'address',
        label: '地址',
        component: 'Input',
      },
      ...getAdvanceSchema(10),
      {
        field: `field11`,
        label: `Slot示例`,
        component: 'Select',
        slot: 'custom',
      },
    ],
  };
}
export function getBasicData() {
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
  return data;
}

export function getTreeTableData() {
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
        children: [
          {
            id: `l2-${index}`,
            name: 'John Brown',
            age: `1${index}`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
          },
        ],
      });
    }
    return arr;
  })();

  return data;
}
