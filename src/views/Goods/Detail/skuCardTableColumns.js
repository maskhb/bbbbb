import React from 'react';
import { Radio, Input, InputNumber, Select, Popconfirm } from 'antd';
import { listToOptions, optionsToHtml } from 'components/DataTransfer';
import ISSTATUS from 'components/IsStatus';
import ONLINESTATUS from 'components/OnlineStatus';
import AUDITSTATUS from 'components/AuditStatus';

export default (me, datasource, disabled, form, pattern, detail, partEdit) => {
  // 取最新的一条数据
  const json = datasource?.[datasource.length - 1]?.skuPropertyRelationVoSList || [];

  // 动态表单字段
  const dynamicFileds = json.map((k) => {
    return {
      title: <span className={k.isRequired === 1 ? 'ant-form-item-required' : ''}>{k.propertyKey || k.propertyName}</span>,
      dataIndex: `skuProp_${k.propertyKeyId}`,
      render: (v) => {
        return v || '--';
      },
      width: 200,
      align: 'center',
      // fixed: 'left',
    };
  });

  const skuIdFields = pattern !== 'add'
    ? [{
      title: 'SKUID',
      dataIndex: 'skuId',
      width: 120,
      fixed: 'left',
      align: 'center',
      render: val => (String(val).match('-') ? '' : val),
    }]
    : [];
  const editOnlyFileds = pattern !== 'add'
    ? [
      {
        title: '实际库存',
        dataIndex: 'totalNum',
        render: (text, record) => (
          disabled
            ? text
            : (
              <InputNumber
                value={text}
                min={record.occupyNum || 0}
                step={1}
                disabled={disabled}
                style={{ width: '100%' }}
                onChange={value => me.handleChangeColumn(value, record.skuId, 'totalNum')}
              />
            )
        ),
        width: 160,
        align: 'center',

      },
      {
        title: '占用库存',
        dataIndex: 'occupyNum',
        width: 160,
        align: 'center',
      },
    ]
    : [];
  const statusFields = pattern !== 'add'
    ? [{
      title: '状态',
      dataIndex: 'status',
      render(val, record) {
        const current = Object.values(ONLINESTATUS).find(
          ({ value }) => value === val);
        const targetStatus = val === ONLINESTATUS.ON.value
          ? ONLINESTATUS.OFF.value
          : ONLINESTATUS.ON.value;
        const targetText = Object.values(ONLINESTATUS).find(
          ({ value }) => value === targetStatus).text;
        const text = (
          <Popconfirm
            placement="top"
            title={`确认${targetText.replace('已', '')}？`}
            onConfirm={me.handleSkuUpdate.bind(me, record, targetStatus)}
            okText="确认"
            cancelText="取消"
          >
            <a>{current?.text}</a>
          </Popconfirm>
        );

        // 如果可售库存为0，自动下架，且不可操作
        let aText = record.totalNum - record.occupyNum === 0 ? <a disabled>下架</a> : '';
        if (detail?.auditStatus === AUDITSTATUS.FAIL.value && val !== ONLINESTATUS.ON.value) {
          // 商品下架状态，不允许上架操作
          aText = <a disabled>{current?.text}</a>;
        }

        return aText || (disabled ? current?.text : text);
      },
      width: 96,
      align: 'center',
      fixed: 'right',
    }]
    : [];

  const { goodsImgGroupVoList } = form.getFieldsValue();
  const imagesOptions = listToOptions(
    (goodsImgGroupVoList?.imageGroups || []),
    'imgGroupId',
    'imgGroupName',
  );
  const imagesOptionsHtml = optionsToHtml(imagesOptions);

  return [
    {
      title: '默认',
      dataIndex: 'key',
      render: (val, record) => {
        return (
          <Radio
            checked={record.isDefault === ISSTATUS.YES.value}
            onChange={() => me.handleChangeDefault(record.skuId)}
            disabled={disabled || partEdit}
          />
        );
      },
      width: 64,
      align: 'center',
      fixed: 'left',
    },
    ...skuIdFields,
    ...dynamicFileds,
    {
      title: '图片组',
      dataIndex: 'imgGroupId',
      render: (val, record) => (
        disabled || partEdit
          ? imagesOptions?.find(({ value }) => value === Number(val))?.label
          : (
            <Select
              value={val || 0}
              style={{ minWidth: 160 }}
              onChange={value => me.handleChangeColumn(value, record.skuId, 'imgGroupId')}
              disabled={disabled || partEdit}
            >
              {imagesOptionsHtml}
            </Select>
          )
      ),
      width: pattern === 'edit' ? 190 : 220,
      align: 'center',
    },
    ...editOnlyFileds,
    {
      title: '可售库存',
      dataIndex: 'remainNum',
      render: (text, record) => (
        pattern !== 'add'
          ? text
          : (
            <InputNumber
              value={text}
              min={0}
              step={1}
              disabled={pattern !== 'add'}
              style={{ width: '100%' }}
              onChange={value => me.handleChangeColumn(value, record.skuId, 'remainNum')}
            />
          )
      ),
      width: 160,
      align: 'center',
    },
    {
      title: '商家SKU编码',
      dataIndex: 'skuCode',
      render: (text, record) => (
        disabled || partEdit
          ? text
          : (
            <Input
              disabled={disabled || partEdit}
              value={text}
              maxLength="50"
              onChange={e => me.handleChangeColumn(e.target.value, record.skuId, 'skuCode')}
              width={160}
            />
          )
      ),
      align: 'center',
      width: 160,
    },
    {
      title: '条形码',
      dataIndex: 'barCode',
      render: (text, record) => (
        disabled || partEdit
          ? text
          : (
            <Input
              value={text}
              disabled={disabled || partEdit}
              maxLength="50"
              onChange={e => me.handleChangeColumn(e.target.value, record.skuId, 'barCode')}
              width={160}
            />
          )
      ),
      align: 'center',
      width: 160,
    },
    {
      title: '供货价',
      dataIndex: 'supplyPrice',
      render: (text, record) => (
        disabled
          ? text
          : (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={value => me.handleChangeColumn(value, record.skuId, 'supplyPrice')}
            />
          )
      ),
      align: 'center',
      width: 180,
    },
    {
      title: '折扣价',
      dataIndex: 'discountPrice',
      render: (text, record) => (
        disabled
          ? text
          : (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={value => me.handleChangeColumn(value, record.skuId, 'discountPrice')}
            />
          )
      ),
      align: 'center',
      width: 180,
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: (text, record) => (
        disabled
          ? text
          : (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={value => me.handleChangeColumn(value, record.skuId, 'salePrice')}
            />
          )
      ),
      align: 'center',
      width: 180,
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      render: (text, record) => (
        disabled
          ? text
          : (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={value => me.handleChangeColumn(value, record.skuId, 'marketPrice')}
            />
          )
      ),
      align: 'center',
      width: 180,
    },
    ...statusFields,
    {
      title: '操作',
      render: (record) => {
        const can = !disabled && !partEdit && record.status !== ONLINESTATUS.ON.value &&
          record.isDefault !== ISSTATUS.YES.value;

        return (
          can
            ? (
              <Popconfirm
                placement="top"
                title="确认删除？"
                onConfirm={me.handleSkuDelete.bind(me, record)}
                okText="确认"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            )
            : <a disabled>删除</a>
        );
      },
      width: 96,
      align: 'center',
      fixed: 'right',
    },
  ];
};
