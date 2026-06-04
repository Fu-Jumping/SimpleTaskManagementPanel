import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame}>
      <div className={styles.mainRegistrationCard}>
        <div className={styles.header}>
          <div className={styles.margin}>
            <div className={styles.background}>
              <img
                src="../image/mpy2wpvy-4yo0iz9.svg"
                className={styles.container}
              />
            </div>
          </div>
          <p className={styles.text}>创建新账号</p>
        </div>
        <div className={styles.form}>
          <div className={styles.usernameInput}>
            <div className={styles.input}>
              <div className={styles.container2}>
                <p className={styles.text2}>用户名</p>
              </div>
              <img src="../image/mpy2wpvy-nwa17ha.svg" className={styles.icon} />
            </div>
          </div>
          <div className={styles.passwordInput}>
            <div className={styles.input2}>
              <div className={styles.container2}>
                <p className={styles.text2}>密码</p>
              </div>
              <img src="../image/mpy2wpvy-8g6szo7.svg" className={styles.icon2} />
            </div>
          </div>
          <div className={styles.confirmPasswordInput}>
            <div className={styles.input3}>
              <div className={styles.container2}>
                <p className={styles.text2}>确认密码</p>
              </div>
              <img src="../image/mpy2wpvy-javagfe.svg" className={styles.icon3} />
            </div>
          </div>
          <div className={styles.submitButtonMargin}>
            <div className={styles.submitButton}>
              <p className={styles.text3}>注册</p>
            </div>
          </div>
        </div>
        <div className={styles.footerLink}>
          <p className={styles.text4}>已有账号？</p>
          <div className={styles.link}>
            <p className={styles.text5}>立即登录</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
