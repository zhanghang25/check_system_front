<template>
  <div class="main-container">
    <TableBody ref="tableBody">
      <template #header>
        <TableHeader
          :show-filter="true"
          title="查询条件"
          @search="onSearch"
          @reset-search="onResetSearch"
        >
          <template #search-content>
            <DataForm
              ref="searchForm"
              :form-config="{
                labelWidth: 60,
              }"
              :options="conditionItems"
              preset="grid-item"
            />
          </template>
          <template #top-right>
            <AddButton @add="onAddItem" />
          </template>
        </TableHeader>
      </template>
      <template #default>
        <n-data-table
          size="small"
          :loading="tableLoading"
          :data="dataList"
          :columns="tableColumns"
          :row-key="rowKey"
          :style="{ height: `${tableHeight}px` }"
          :flex-height="true"
        />
      </template>
      <template #footer>
        <TableFooter :pagination="pagination" />
      </template>
    </TableBody>
    <ModalDialog ref="modalDialog" @confirm="onDataFormConfirm">
      <template #content>
        <DataForm ref="itemDataFormRef" :options="itemFormOptions" />
      </template>
    </ModalDialog>
    <ModalDialog ref="modalDialog2" @confirm="onDataFormConfirm2">
      <template #content>
        <DataForm ref="itemDataFormRef2" :options="itemFormOptions2" />
      </template>
    </ModalDialog>
  </div>
</template>

<script lang="ts">
  import { baseURL } from '@/api/axios.config'
  import { post, Response } from '@/api/http'
  import { getCheJian, getTableList } from '@/api/url'
  import { renderTag, renderRadioButtonGroup, renderSelect, renderDatePicker } from '@/hooks/form'
  import {
    usePagination,
    useRowKey,
    useTable,
    useTableColumn,
    useTableHeight,
    useRenderAction,
    TableActionModel,
  } from '@/hooks/table'
  import { DataFormType, FormItem, ModalDialogType } from '@/types/components'
  import {
    DataTableColumn,
    NAvatar,
    NCheckbox,
    NCheckboxGroup,
    NDatePicker,
    NInput,
    NSelect,
    NSpace,
    NTimePicker,
    SelectOption,
    useMessage,
    useDialog,
    NButton,
    NUpload,
  } from 'naive-ui'
  import type { UploadFileInfo } from 'naive-ui'
  import { defineComponent, h, onMounted, ref, nextTick, shallowReactive } from 'vue'
  const modalDialog = ref<ModalDialogType | null>(null)
  const modalDialog2 = ref<ModalDialogType | null>(null)
  const itemDataFormRef = ref<DataFormType | null>(null)
  const itemDataFormRef2 = ref<DataFormType | null>(null)
  let options = [] as Array<{ label: string; value: number }>
  const itemFormOptions = [
    {
      key: 'yanAn',
      label: '作业部门',

      value: ref('22222'),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = 111
          },
          onVnodeMounted: () => {
            nextTick(() => {
              formItem.value.value = '延安工务段'
            })
          },
          onVnodeBeforeUnmount: () => {
            nextTick(() => {
              formItem.value.value = '延安工务段'
            })
          },
          maxlength: 50,
          disabled: true,
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入作业部门')
          return false
        }
        return true
      },
    },
    {
      key: 'cheJian',
      label: '作业单位',
      //   type: 'input',
      // optionItems: options,
      value: ref(null),
      render: (formItem) => {
        return h(NSelect, {
          options,
          value: formItem.value.value,
          onUpdateValue: (newVal: any) => {
            formItem.value.value = newVal
          },
          onUpdateShow: async () => {
            let res = await post({ url: getCheJian })
            options = res.data
            console.log('options', options)
            itemDataFormRef.value?.$forceUpdate()
          },
        })
      },
      required: true,
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入作业单位')
          return false
        }
        return true
      },
    },
    {
      label: '作业日期',
      key: 'workDate',
      value: ref(null),
      render: (formItem) => {
        return renderDatePicker(formItem.value, {
          type: 'date',
          style: 'width: 100%',
        })
      },
      required: true,
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入作业日期')
          return false
        }
        return true
      },
    },
    {
      key: 'workType',
      label: '作业类型',

      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = 111
          },
          onVnodeMounted: () => {
            nextTick(() => {
              formItem.value.value = '维修'
            })
          },
          maxlength: 50,
          disabled: true,
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入部门名称')
          return false
        }
        return true
      },
    },
    {
      label: '专业系统',
      key: 'jobType',
      value: ref(1),
      required: true,
      render: (formItem) => {
        return renderRadioButtonGroup(formItem.value, [
          {
            label: '线路',
            value: 1,
          },
          {
            label: '桥路',
            value: 2,
          },
        ])
      },
    },
    {
      label: '作业级别',
      key: 'gradeType',
      value: ref(1),
      required: true,
      render: (formItem) => {
        return renderRadioButtonGroup(formItem.value, [
          {
            label: 'I级',
            value: 1,
          },
          {
            label: 'II级',
            value: 2,
          },
        ])
      },
    },
    {
      key: 'workContent',
      label: '作业内容',

      required: true,
      value: ref('22222'),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },
          type: 'textarea',
          maxlength: 50,
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入作业内容')
          return false
        }
        return true
      },
    },
    {
      key: 'workPlan',
      label: '作业方案',
      value: ref(null),
      render: (formItem) => {
        return h(
          NUpload,
          {
            responseType: 'json',
            action: baseURL + 'user/upload',
            headers: "{'Content-Type': 'application/form-data; charset=UTF-8'}",
            onFinish: ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
              console.log(event)
              // message.success((event?.target as XMLHttpRequest).response)
              const ext = file.name.split('.')[1]
              console.log(file.name)
              console.log(file)
              // file.name = `更名.${ext}`
              // file.url = '__HTTPS__://www.mocky.io/v2/5e4bafc63100007100d8b70f'
              return file
            },
          },
          {
            default: () => {
              return h(NButton, {}, '提交作业方案')
            },
          }
        )
      },
    },
  ] as Array<FormItem>
  const itemFormOptions2 = [
    {
      key: 'nameee',
      label: '部门名称',
      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },
          maxlength: 50,
          placeholder: '请输入部门名称',
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入部门名称')
          return false
        }
        return true
      },
    },
  ] as Array<FormItem>
  const conditionItems: Array<FormItem> = [
    {
      key: 'name',
      label: '用户姓名',
      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
          placeholder: '请输入姓名',
        })
      },
    },
    {
      key: 'sex',
      label: '用户姓别',
      value: ref(null),
      optionItems: [
        {
          label: '男',
          value: 0,
        },
        {
          label: '女',
          value: 1,
        },
      ],
      render: (formItem) => {
        return h(NSelect, {
          options: formItem.optionItems as Array<SelectOption>,
          value: formItem.value.value,
          placeholder: '请选择用户姓别',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
        })
      },
    },
    {
      key: 'date',
      label: '日期',
      value: ref(null),
      render: (formItem) => {
        return h(NDatePicker, {
          value: formItem.value.value,
          placeholder: '请选择日期',
          style: 'width: 100%',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
          type: 'date',
        })
      },
    },
    {
      key: 'time',
      label: '时间',
      value: ref(null),
      render: (formItem) => {
        return h(NTimePicker, {
          options: formItem.optionItems as Array<SelectOption>,
          value: formItem.value.value,
          placeholder: '请选择时间',
          style: 'width: 100%',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
        })
      },
    },
    {
      key: 'checkbox',
      label: '复选',
      value: ref(null),
      optionItems: [
        {
          label: '选项1',
          value: 0,
        },
        {
          label: '选项2',
          value: 1,
        },
      ],
      render: (formItem) => {
        return h(
          NCheckboxGroup,
          {
            options: formItem.optionItems as Array<SelectOption>,
            value: formItem.value.value,
            placeholder: '请选择用户姓别',
            onUpdateValue: (val) => {
              formItem.value.value = val
            },
          },
          {
            default: () => {
              return h(
                NSpace,
                {
                  itemStyle: 'display: flex;',
                },
                {
                  default: () => {
                    return formItem.optionItems?.map((it) => {
                      return h(NCheckbox, {
                        key: it.value,
                        label: it.label,
                        value: it.value,
                      })
                    })
                  },
                }
              )
            },
          }
        )
      },
    },
  ]
  export default defineComponent({
    name: 'TableWithSearch',
    setup() {
      const searchForm = ref<DataFormType | null>(null)
      const pagination = usePagination(doRefresh)
      pagination.pageSize = 20
      const naiveDailog = useDialog()
      const table = useTable()
      const message = useMessage()
      const rowKey = useRowKey('id')
      const tableColumns = useTableColumn(
        [
          table.selectionColumn,
          table.indexColumn,
          {
            title: '作业部门',
            key: 'yanAn',
            width: 80,
          },
          {
            title: '作业单位',
            key: 'cheJian',
            width: 80,
          },
          {
            title: '作业日期',
            key: 'workDate',
            width: 100,
          },
          {
            title: '作业类型',
            key: 'workType',
            width: 80,
          },
          {
            title: '专业系统',
            key: 'jobType',
            width: 80,
          },
          {
            title: '作业级别',
            key: 'gradeType',
            width: 80,
            render: (rowData) =>
              renderTag(!!rowData.status ? 'I级' : 'II级', {
                type: !!rowData.status ? 'success' : 'error',
                size: 'small',
              }),
          },

          {
            title: '作业内容',
            key: 'workContent',
            width: 180,
          },
          {
            title: '审核部门',
            key: 'checkDept',
            width: 80,
          },
          {
            title: '审核人',
            key: 'checkPerson',
            width: 80,
          },
          {
            title: '审核意见',
            key: 'checkMsg',
            width: 130,
          },
          {
            title: '审核时间',
            key: 'checkTime',
            width: 120,
          },
          {
            title: '操作',
            key: 'actions',
            render: (rowData) => {
              return useRenderAction([
                {
                  label: '审核',
                  onClick() {},
                },
                {
                  label: '删除',
                  type: 'error',
                  onClick() {
                    onDeleteItem(rowData)
                  },
                },
              ] as TableActionModel[])
            },
          },
        ],
        {
          align: 'center',
        } as DataTableColumn
      )
      const onDeleteItem = (item: any) => {
        naiveDailog.warning({
          title: '提示',
          content: '确定要删除此信息，删除后不可恢复？',
          positiveText: '删除',
          negativeText: '再想想',
          onPositiveClick: () => {
            // filterItems(table.dataList.value!, item)
          },
        })
      }
      function doRefresh() {
        post({
          url: getTableList,
          data: () => {
            return {
              page: pagination.page,
              pageSize: pagination.pageSize,
            }
          },
        })
          .then((res) => {
            table.handleSuccess(res)
            pagination.setTotalSize(res.totalSize || 10)
          })
          .catch(console.log)
      }
      function onSearch() {
        message.success(
          '模拟查询成功，参数为：' + JSON.stringify(searchForm.value?.generatorParams())
        )
      }
      function onAddItem() {
        modalDialog.value?.toggle()
        nextTick(() => {
          itemDataFormRef.value?.reset()
        })
      }
      function onDataFormConfirm2() {
        if (itemDataFormRef2.value?.validator()) {
          modalDialog.value?.toggle()
          naiveDailog.success({
            title: '提示',
            positiveText: '确定',
            content:
              '模拟部门添加/编辑成功，数据为：' +
              JSON.stringify(itemDataFormRef2.value.generatorParams()),
          })
        }
      }
      function onDataFormConfirm() {
        if (itemDataFormRef.value?.validator()) {
          modalDialog.value?.toggle()
          naiveDailog.success({
            title: '提示',
            positiveText: '确定',
            content:
              '模拟部门添加/编辑成功，数据为：' +
              JSON.stringify(itemDataFormRef.value.generatorParams()),
          })
        }
      }
      function onResetSearch() {
        searchForm.value?.reset()
      }
      onMounted(async () => {
        table.tableHeight.value = await useTableHeight()
        doRefresh()
      })
      return {
        ...table,
        rowKey,
        pagination,
        searchForm,
        tableColumns,
        conditionItems,
        onSearch,
        onResetSearch,
        onAddItem,
        onDeleteItem,
        onDataFormConfirm,
        itemFormOptions,
        modalDialog,
        itemDataFormRef,
        onDataFormConfirm2,
        itemFormOptions2,
        modalDialog2,
        itemDataFormRef2,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .avatar-container {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 0 auto;
    vertical-align: middle;
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .avatar-vip {
      border: 2px solid #cece1e;
    }
    .vip {
      position: absolute;
      top: 0;
      right: -9px;
      width: 15px;
      transform: rotate(60deg);
    }
  }
  .gender-container {
    .gender-icon {
      width: 20px;
    }
  }
</style>
