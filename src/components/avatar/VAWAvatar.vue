<template>
  <div class="vaw-avatar-container">
    <n-dropdown trigger="hover" :options="options" size="large" @select="handleSelect">
      <div class="action-wrapper">
        <div class="avatar">
          <n-avatar circle size="small" :src="userStore.avatar" />
        </div>
        <span class="nick-name">
          {{ userStore.nickName }}
          <n-icon class="tip">
            <CaretDownSharp />
          </n-icon>
        </span>
      </div>
    </n-dropdown>
  </div>
  <ModalDialog ref="modalDialog" @confirm="onDataFormConfirm">
    <template #content>
      <DataForm ref="itemDataFormRef" :options="itemFormOptions" />
    </template>
  </ModalDialog>
</template>

<script lang="ts">
  import { NIcon, useDialog, useMessage } from 'naive-ui'
  import { defineComponent, ref, h } from 'vue'
  import { Menu, LogInOutline, CaretDownSharp } from '@vicons/ionicons5'
  import useUserStore from '@/store/modules/user'
  import { useRouter } from 'vue-router'
  import { ModalDialogType, DataFormType, FormItem } from '@/types/components'
  import { renderInput } from '@/hooks/form'
  import { updatePassword } from '@/api/url'

  const modalDialog = ref<ModalDialogType | null>(null)
  const itemDataFormRef = ref<DataFormType | null>(null)
  const itemFormOptions = [
    {
      key: 'oldPassword',
      label: '老密码',
      required: true,
      value: ref(null),
      render: (formItem) => {
        return renderInput(formItem.value, {
          placeholder: '请输入老密码！',
          type: 'password',
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入老密码')
          return false
        }
        return true
      },
    },
    {
      key: 'password',
      label: '新密码',
      required: true,
      value: ref(null),
      render: (formItem) => {
        return renderInput(formItem.value, {
          placeholder: '请输入新密码！',
          type: 'password',
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入新密码')
          return false
        }

        return true
      },
    },
    {
      key: 'newPassword',
      label: '重复新密码',
      required: true,
      value: ref(null),
      render: (formItem) => {
        return renderInput(formItem.value, {
          placeholder: '请输入新密码！',
          type: 'password',
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入新密码')
          return false
        }

        return true
      },
    },
  ] as Array<FormItem>
  import { post } from '@/api/http'
  export default defineComponent({
    name: 'VAWAvatar',
    components: { CaretDownSharp },
    setup() {
      const userStore = useUserStore()
      const message = useMessage()
      const naiveDailog = useDialog()
      const router = useRouter()
      function onDataFormConfirm() {
        if (itemDataFormRef.value?.validator()) {
          const params = itemDataFormRef.value.generatorParams()
          if (params.password != params.newPassword) {
            message.error('重复密码错误！')
            return false
          }
          post({ url: updatePassword, data: params }).then(() => {
            modalDialog.value?.toggle()
            naiveDailog.success({
              title: '提示',
              positiveText: '确定',
              content: '提交成功！',
              // JSON.stringify(itemDataFormRef.value.generatorParams()),
            })
          })
        }
      }
      const options = [
        {
          label: '修改密码',
          key: 'personal-center',
          icon: () =>
            h(NIcon, null, {
              default: () => h(Menu),
            }),
        },
        {
          label: '退出登录',
          key: 'logout',
          icon: () =>
            h(NIcon, null, {
              default: () => h(LogInOutline),
            }),
        },
      ]
      function personalCenter() {
        modalDialog.value?.toggle()
        // router.push('/personal/info')
      }
      const dialog = useDialog()
      function logout() {
        dialog.warning({
          title: '提示',
          content: '是否要退出当前账号？',
          positiveText: '退出',
          negativeText: '再想想',
          onPositiveClick: () => {
            userStore.logout().then(() => {
              window.location.reload()
            })
          },
        })
      }
      function handleSelect(key: string) {
        switch (key) {
          case 'personal-center':
            personalCenter()
            break
          case 'logout':
            logout()
            break
        }
      }
      return {
        userStore,
        options,
        handleSelect,
        onDataFormConfirm,
        itemFormOptions,
        modalDialog,
        itemDataFormRef,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .vaw-avatar-container {
    .action-wrapper {
      display: flex;
      align-items: center;
      .avatar {
        width: calc(#{$logoHeight} - 15px);
        height: calc(#{$logoHeight} - 15px);
        display: flex;
        align-items: center;
        & > img {
          border: 1px solid #f6f6f6;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .nick-name {
        margin: 0 5px;
        .tip {
          transform: rotate(0);
          transition: transform $transitionTime;
          margin-left: 2px;
        }
      }
    }
  }
  .vaw-avatar-container:hover {
    cursor: pointer;
    color: var(--primary-color);
    .nick-name .tip {
      transform: rotate(180deg);
      transition: transform $transitionTime;
    }
  }
</style>
