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
                labelWidth: 120,
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
        <NButton style="margin-block: 10px" type="info" ghost @click="seePlan"
          >查看工作计划</NButton
        >
        <DataForm ref="itemDataFormRef2" :options="itemFormOptions2" />
      </template>
    </ModalDialog>
  </div>
</template>

<script lang="ts">
  import { baseURL } from '@/api/axios.config'
  import { addCheJianRecord, checkCheJianRecord, getMenuListByRoleId } from '@/api/url'
  import { get, post } from '@/api/http'
  import { getCheJianRecord, deleteCheJianRecord, getCheJian } from '@/api/url'
  import { renderTag, renderRadioButtonGroup, renderDatePicker } from '@/hooks/form'
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
    NInput,
    SelectOption,
    useDialog,
    NButton,
    NUpload,
    NSelect,
    useMessage,
  } from 'naive-ui'
  import type { UploadFileInfo } from 'naive-ui'
  import { defineComponent, h, onMounted, ref, nextTick } from 'vue'
  const modalDialog = ref<ModalDialogType | null>(null)
  const modalDialog2 = ref<ModalDialogType | null>(null)
  const itemDataFormRef = ref<DataFormType | null>(null)
  const itemDataFormRef2 = ref<DataFormType | null>(null)
  const itemFormOptions = [
    {
      key: 'yanAn',
      label: '作业部门',

      value: ref('22222'),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
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

      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },
          onVnodeMounted: () => {
            nextTick(async () => {
              const res = await get({ url: baseURL + getMenuListByRoleId })
              formItem.value.value = res.data.username
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
      key: 'cheJianId',
      label: '作业单位Id',
      hidden: true,
      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },

          onVnodeMounted: () => {
            nextTick(async () => {
              const res = await get({ url: baseURL + getMenuListByRoleId })
              formItem.value.value = res.data.id
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
      label: '作业日期',
      key: 'workDate',
      value: ref(null),
      render: (formItem) => {
        return renderDatePicker(formItem.value, {
          type: 'date',
          style: 'width: 100%',
          valueFormat: 'yyyy-MM-dd',
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
            formItem.value.value = newVal
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
      value: ref('null'),
      render: (formItem) => {
        // formItem.value.value = formItem.value.value ? formItem.value.value : '1111'
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
      required: true,
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入作业方案！')
          return false
        }
        return true
      },
      key: 'workPlan',
      label: '作业方案',
      value: ref(null),
      render: (formItem) => {
        let targetObj = { aaa: '111' } as any
        return h(
          NUpload,
          {
            max: 1,
            data: targetObj,
            responseType: 'json',
            action: baseURL + 'user/upload',
            headers: "{'Content-Type': 'application/form-data; charset=UTF-8'}",
            onBeforeUpload: ({ file }: { file: any }) => {
              const originalFileName = file?.file?.name ? file.file.name : '情况文件.docx'
              const encodedFileName = encodeURIComponent(originalFileName)
              targetObj.newName = encodedFileName
              return true
            },
            onFinish: ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
              console.log(event)

              // message2.success('上传成功！')
              // const ext = file.name.split('.')[1]
              formItem.value.value = (event?.target as XMLHttpRequest).response.data
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
      key: 'checkPerson',
      label: '审核人',
      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },
          maxlength: 50,
          placeholder: '请输入审核人',
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入审核人')
          return false
        }
        return true
      },
      required: true,
    },
    {
      key: 'checkMsg',
      label: '审核意见',
      value: ref(null),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },
          maxlength: 50,
          placeholder: '请输入审核意见',
        })
      },
      required: true,
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入审核意见')
          return false
        }
        return true
      },
    },
  ] as Array<FormItem>

  const conditionItems: Array<FormItem> = [
    {
      key: 'jobType',
      label: '专业系统',
      value: ref(null),
      optionItems: [
        {
          label: '线路',
          value: 1,
        },
        {
          label: '桥路',
          value: 2,
        },
      ],
      render: (formItem) => {
        return h(NSelect, {
          options: formItem.optionItems as Array<SelectOption>,
          value: formItem.value.value,
          placeholder: '请选择专业系统',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
        })
      },
    },
    {
      key: 'gradeType',
      label: '作业级别',
      value: ref(null),
      optionItems: [
        {
          label: 'I级',
          value: 1,
        },
        {
          label: 'II级',
          value: 2,
        },
      ],
      render: (formItem) => {
        return h(NSelect, {
          options: formItem.optionItems as Array<SelectOption>,
          value: formItem.value.value,
          placeholder: '请选择作业级别',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
        })
      },
    },
    {
      key: 'checkStatus',
      label: '审核状态',
      value: ref(null),
      optionItems: [
        {
          label: '未审核',
          value: false,
        },
        {
          label: '已审核',
          value: true,
        },
      ],
      render: (formItem) => {
        return h(NSelect, {
          options: formItem.optionItems as Array<SelectOption>,
          value: formItem.value.value,
          placeholder: '请选择审核状态',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
        })
      },
    },
  ]
  const searchForm = ref<DataFormType | null>(null)
  export default defineComponent({
    name: 'TableWithSearch',
    setup() {
      const pagination = usePagination(doRefresh)
      pagination.pageSize = 20
      const naiveDailog = useDialog()
      const message = useMessage()
      const table = useTable()
      const rowKey = useRowKey('id')
      const tableColumns = useTableColumn(
        [
          table.selectionColumn,
          table.indexColumn,
          {
            title: '作业部门',
            key: 'yanAn',
            width: 120,
          },
          {
            title: '作业单位',
            key: 'cheJian',
            width: 200,
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
            render: (rowData) =>
              renderTag(rowData.jobType == 1 ? '线路' : '桥路', {
                type: rowData.jobType == 1 ? 'success' : 'info',
                size: 'medium',
              }),
            width: 80,
          },
          {
            title: '作业级别',
            key: 'gradeType',
            width: 80,
            render: (rowData) =>
              renderTag(rowData.gradeType == 1 ? 'I级' : 'II级', {
                type: rowData.gradeType == 1 ? 'warning' : 'error',
                size: 'medium',
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
            render: (rowData) => {
              const date = new Date(rowData.checkTime as string)
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              const hour = String(date.getHours()).padStart(2, '0')
              const minute = String(date.getMinutes()).padStart(2, '0')
              const second = String(date.getSeconds()).padStart(2, '0')
              const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`
              return formattedDate != '1970-01-01 08:00:00'
                ? renderTag(formattedDate, { type: 'error', size: 'medium' })
                : ''
            },
            width: 120,
          },
          {
            title: '操作',
            key: 'actions',
            render: (rowData) => {
              return useRenderAction([
                {
                  label: '查看计划',
                  type: 'warning',
                  onClick() {
                    window.location.href = baseURL + rowData.workPlan
                  },
                },
                {
                  label: '审核',
                  onClick: onUpdateItem.bind(null, rowData),
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

      function seePlan() {
        window.location.href = baseURL + workPlan
      }
      let checkRecordId = 0
      let workPlan = ''
      function onUpdateItem(item: any) {
        if (item.checkStatus == 1) {
          message.error('您已经审核过了，无需再审核！')
          return
        }
        modalDialog2.value?.toggle()
        nextTick(() => {
          checkRecordId = item.id
          workPlan = item.workPlan
          // formItems.forEach((it) => {
          //   const key = it.key
          //   const propName = item[key]
          //   if (propName) {
          //     if (it.key === 'roleCode') {
          //       it.value.value = propName.replace(ROLE_CODE_FLAG, '')
          //     } else {
          //       it.value.value = propName
          //     }
          //   }
          // })
        })
      }
      const onDeleteItem = (item: any) => {
        naiveDailog.warning({
          title: '提示',
          content: '确定要删除此信息，删除后不可恢复？',
          positiveText: '删除',
          negativeText: '再想想',
          onPositiveClick: () => {
            // filterItems(table.dataList.value!, item)
            get({ url: deleteCheJianRecord + '/' + item.id }).then(() => {
              doRefresh()
            })
          },
        })
      }
      function doRefresh() {
        post({
          url: getCheJianRecord,
          data: () => {
            let tmpParams = searchForm.value?.generatorParams()
              ? searchForm.value.generatorParams()
              : permanentSearch.value

            return {
              page: pagination.page,
              pageSize: pagination.pageSize,
              ...tmpParams,
            }
          },
        })
          .then((res) => {
            table.handleSuccess(res.data)
            pagination.setTotalSize(res.data.totalSize || 10)
          })
          .catch(console.log)
      }
      const permanentSearch = ref({})
      function onSearch() {
        // message.success(
        //   '模拟查询成功，参数为：' + JSON.stringify(searchForm.value?.generatorParams())
        // )
        permanentSearch.value = searchForm.value?.generatorParams()
        doRefresh()
      }
      function onAddItem() {
        modalDialog.value?.toggle()
        nextTick(() => {
          itemDataFormRef.value?.reset()
        })
      }
      function onDataFormConfirm2() {
        if (itemDataFormRef2.value?.validator()) {
          const params = itemDataFormRef2?.value.generatorParams()
          // naiveDailog.success({
          //   title: '提示',
          //   positiveText: '确定',
          //   content: '确定审批吗？',
          //   onPositiveClick: () => {
          post({
            url: checkCheJianRecord + '/' + checkRecordId,
            data: params,
          }).then(() => {
            modalDialog2.value?.toggle()
            itemDataFormRef2.value?.reset()
            doRefresh()
          })
          //   },
          // })
        }
      }
      function onDataFormConfirm() {
        if (itemDataFormRef.value?.validator()) {
          post({ url: addCheJianRecord, data: itemDataFormRef.value.generatorParams() }).then(
            () => {
              modalDialog.value?.toggle()
              doRefresh()
              naiveDailog.success({
                title: '提示',
                positiveText: '确定',
                content: '提交成功！',
                // JSON.stringify(itemDataFormRef.value.generatorParams()),
              })
            }
          )
        }
      }
      function onResetSearch() {
        searchForm.value?.reset()

        permanentSearch.value = searchForm.value?.generatorParams()
      }
      onMounted(async () => {
        table.tableHeight.value = await useTableHeight()
        doRefresh()
      })
      return {
        ...table,
        checkRecordId,
        workPlan,
        seePlan,
        rowKey,
        pagination,
        searchForm,
        tableColumns,
        conditionItems,
        onSearch,
        onResetSearch,
        onAddItem,
        onDeleteItem,
        onUpdateItem,
        onDataFormConfirm,
        itemFormOptions,
        modalDialog,
        itemDataFormRef,
        onDataFormConfirm2,
        itemFormOptions2,
        modalDialog2,
        itemDataFormRef2,
        permanentSearch,
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
