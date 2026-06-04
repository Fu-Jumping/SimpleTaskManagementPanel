import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.overlayMask}>
      <div className={styles.asideEditTaskDrawerS}>
        <div className={styles.drawerHeader}>
          <p className={styles.text}>编辑任务</p>
          <div className={styles.frame}>
            <img src="../image/mpy2wtzr-i7tpz0x.svg" className={styles.container} />
          </div>
        </div>
        <div className={styles.drawerContentBody}>
          <div className={styles.taskTitleInput}>
            <p className={styles.text2}>任务标题</p>
            <div className={styles.container2}>
              <p className={styles.text3}>完成首页 UI 设计定稿</p>
            </div>
          </div>
          <div className={styles.taskDescriptionTexta}>
            <p className={styles.text2}>任务描述</p>
            <div className={styles.container3}>
              <p className={styles.text4}>
                根据最新的品牌指南，优化首页的色彩层级和卡片阴影细节。
                <br />
                确保在移动端的响应式表现良好。
              </p>
            </div>
          </div>
          <div className={styles.datePickerSimulatedU}>
            <p className={styles.text2}>截止日期</p>
            <div className={styles.button}>
              <div className={styles.container5}>
                <img
                  src="../image/mpy2wtzr-0kh7w0x.svg"
                  className={styles.container4}
                />
                <p className={styles.text5}>2023年10月24日</p>
              </div>
              <img
                src="../image/mpy2wtzr-6zreml3.svg"
                className={styles.container6}
              />
            </div>
          </div>
          <div className={styles.priorityToggle}>
            <p className={styles.text2}>状态</p>
            <div className={styles.background}>
              <p className={styles.text6}>待处理</p>
              <div className={styles.button2}>
                <p className={styles.text7}>进行中</p>
              </div>
              <p className={styles.text6}>已完成</p>
            </div>
          </div>
          <div className={styles.container7}>
            <p className={styles.text2}>优先级</p>
            <div className={styles.background2}>
              <img src="../image/mpy2wtzr-tqj6iq2.svg" className={styles.button3} />
              <img src="../image/mpy2wtzr-9jnmjfm.svg" className={styles.button4} />
              <img src="../image/mpy2wtzr-bt2060c.svg" className={styles.button5} />
            </div>
          </div>
        </div>
        <div className={styles.drawerFooterActions}>
          <div className={styles.button6}>
            <img
              src="../image/mpy2wtzr-etlw0e7.svg"
              className={styles.container8}
            />
            <p className={styles.text8}>删除</p>
          </div>
          <div className={styles.container10}>
            <p className={styles.text9}>取消</p>
            <div className={styles.button7}>
              <img
                src="../image/mpy2wtzr-1bpo96j.svg"
                className={styles.container9}
              />
              <p className={styles.text7}>更新任务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
