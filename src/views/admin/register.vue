<template>
  <n-space vertical>
    <n-card
      title="请填写部署的部门信息"
      :content-style="{ padding: '10px' }"
      :header-style="{ padding: '10px' }"
      :segmented="true"
    >
      <template #header-extra>
        <n-button type="primary" size="small" @click="show = !show"> 隐藏 </n-button>
      </template>
      <div class="form-wrapper" v-show="show">
        <DataForm ref="dataForm" :options="formItems" :form-config="formConfig" />
        <div class="flex justify-end">
          <n-button :loading="submitLoading" type="primary" size="small" @click="submit">
            提交
          </n-button>
        </div>
      </div>
    </n-card>
  </n-space>
</template>

<script lang="ts">
  import { DataFormType, FormItem } from '@/types/components'
  import { FormProps, SelectOption, useMessage } from 'naive-ui'
  import { defineComponent, ref } from 'vue'
  import {
    renderCheckbox,
    renderCheckboxGroup,
    renderDatePicker,
    renderInput,
    renderRadioButtonGroup,
    renderSelect,
    renderTimePicker,
  } from '@/hooks/form'
  import { post, Response } from '@/api/http'
  import { register } from '@/api/url'
  export default defineComponent({
    name: 'BaseFormView',
    setup() {
      const message = useMessage()
      const dataForm = ref<DataFormType | null>(null)
      function submit() {
        if (dataForm.value?.validator()) {
          submitLoading.value = true

          console.log(dataForm.value?.generatorParams())
          let data2 = dataForm.value?.generatorParams()
          data2.nickName = data2.username
          post({
            url: register,
            data: data2,
          }).then(({ code }: Response) => {
            submitLoading.value = false
            if (code == 201) {
              message.success('提交成功!')
            } else {
              message.error('提交失败，参数为：' + JSON.stringify(data2))
            }
          })
        }
      }
      const formItems = [
        {
          label: '账号(作业部门[车间]或作业单位[段上])',
          key: 'username',
          required: true,
          value: ref(null),
          render: (formItem) =>
            renderInput(formItem.value, { placeholder: '请输入账号', clearable: true }),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请输入账号')
              return false
            }
            return true
          },
        },
        {
          label: '密码',
          key: 'password',
          required: true,
          value: ref(null),
          render: (formItem) =>
            renderInput(formItem.value, { placeholder: '请输入员工姓名', clearable: true }),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请输入员工姓名')
              return false
            }
            return true
          },
        },
        {
          label: '账号等级',
          key: 'grade',
          value: ref(1),
          render: (formItem) =>
            renderRadioButtonGroup(formItem.value, [
              {
                label: '1级账号',
                value: 1,
              },
              {
                label: '2级账号',
                value: 2,
              },
            ]),
        },
      ] as FormItem[]
      const formConfig = {
        labelWidth: 100,
        size: 'medium',
        labelAlign: 'right',
      } as FormProps
      const submitLoading = ref(false)
      const show = ref(true)
      return {
        dataForm,
        formConfig,
        formItems,
        submitLoading,
        submit,
        show,
      }
    },
  })
</script>

<style lang="scss" scoped>
  @media screen and (max-width: 768px) {
    .form-wrapper {
      width: 100%;
      margin: 0 auto;
    }
  }
  @media screen and (min-width: 768px) {
    .form-wrapper {
      width: 60%;
      margin: 0 auto;
    }
  }
</style>
