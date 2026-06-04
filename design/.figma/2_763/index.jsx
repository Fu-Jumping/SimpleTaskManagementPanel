import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.mainTransactionalPag}>
      <div className={styles.loginCard}>
        <div className={styles.logoBrand}>
          <div className={styles.margin}>
            <div className={styles.background}>
              <img
                src="../image/mpy2wrgw-fu9vifc.svg"
                className={styles.container}
              />
            </div>
          </div>
          <p className={styles.text}>用户登录</p>
          <p className={styles.text2}>欢迎回来</p>
        </div>
        <div className={styles.loginForm}>
          <div className={styles.input}>
            <div className={styles.container2}>
              <p className={styles.text3}>用户名或邮箱</p>
            </div>
            <img
              src="../image/mpy2wrgw-bjk4rxf.svg"
              className={styles.container3}
            />
          </div>
          <div className={styles.input2}>
            <div className={styles.container2}>
              <p className={styles.text3}>密码</p>
            </div>
            <img
              src="../image/mpy2wrgw-qwbtuuz.svg"
              className={styles.container3}
            />
            <img
              src="../image/mpy2wrgw-t62skfv.svg"
              className={styles.container4}
            />
          </div>
          <div className={styles.submitButton}>
            <p className={styles.text4}>登录</p>
          </div>
        </div>
        <p className={styles.text7}>
          <span className={styles.text5}>还没有账号？&nbsp;</span>
          <span className={styles.text6}>立即注册</span>
        </p>
        <div className={styles.decorativeMinimalGlo} />
        <div className={styles.overlayBlur} />
      </div>
    </div>
  );
}

export default Component;
