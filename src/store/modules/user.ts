import { h } from 'vue';
import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { isArray } from '/@/utils/is';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { REFRESH_TOKEN_KEY, REFRESH_UCT_EXPIRES_KEY, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, getRefreshToken, getRefreshUctExpires, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, GrantTypeEnum, LoginParams, LoginResultModel, RegisterParams, RegisterResultModel } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, registerApi } from '/@/api/sys/user';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  refreshToken?: string;
  refreshUctExpires?: number;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRefreshUctExpires(): number {
      return this.refreshUctExpires || getAuthCache<number>(REFRESH_UCT_EXPIRES_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info || '';
      setAuthCache(TOKEN_KEY, info);
    },
    setRefreshToken(model?: LoginResultModel) {
      if (!model) {
        this.refreshToken = undefined;
        this.refreshUctExpires = undefined;
        setAuthCache(TOKEN_KEY, null);
        setAuthCache(REFRESH_TOKEN_KEY, null);
        setAuthCache(REFRESH_UCT_EXPIRES_KEY, null);
        return;
      }
      const { refreshToken, refreshUctExpires } = model;
      this.refreshToken = refreshToken;
      this.refreshUctExpires = refreshUctExpires;
      setAuthCache(REFRESH_TOKEN_KEY, refreshToken);
      setAuthCache(REFRESH_UCT_EXPIRES_KEY, refreshUctExpires);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const model = await loginApi(loginParams, mode);

        // save token
        this.setToken(model?.accessToken);
        this.setRefreshToken(model);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async refreshTokenAction(refreshToken?: string) {
      if (!refreshToken) {
        refreshToken = getRefreshToken();
        const expires = getRefreshUctExpires();
        const now = new Date().getTime();
        if (expires <= now) return;
      }
      const params: LoginParams = {
        grantType: GrantTypeEnum.refreshToken,
        refreshToken: refreshToken,
      };
      const model = await loginApi(params, 'none');
      this.setToken(model?.accessToken);
      this.setRefreshToken(model);
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      if (!userInfo) {
        return null;
      }
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }

      const user: UserInfo = {
        userId: userInfo.userId,
        username: userInfo.username,
        realName: userInfo.realName,
        avatar: userInfo.avatar,
        desc: userInfo.desc,
        roles: userInfo.roles,
      };
      this.setUserInfo(user);
      return user;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
    async register(params: RegisterParams): Promise<RegisterResultModel | undefined> {
      const model = await registerApi(params);
      return model;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
