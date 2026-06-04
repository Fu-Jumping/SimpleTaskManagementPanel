import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame}>
      <div className={styles.appBackgroundSimulat}>
        <div className={styles.backgroundShadow}>
          <p className={styles.toDo}>To Do</p>
          <div className={styles.container}>
            <p className={styles.task1}>Task 1</p>
          </div>
          <div className={styles.container}>
            <p className={styles.task1}>Task 2</p>
          </div>
        </div>
        <div className={styles.heading2}>
          <p className={styles.toDo}>In Progress</p>
        </div>
      </div>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <p className={styles.text}>数据设置</p>
            <div className={styles.button}>
              <img
                src="../image/mpy2wnub-85tcz01.svg"
                className={styles.container2}
              />
            </div>
          </div>
          <div className={styles.tabs}>
            <div className={styles.background}>
              <div className={styles.button2}>
                <p className={styles.text2}>导入</p>
              </div>
              <p className={styles.text3}>导出</p>
            </div>
          </div>
          <div className={styles.contentAreaImportVie}>
            <div className={styles.dragAndDropZone}>
              <div className={styles.background2}>
                <img
                  src="../image/mpy2wnub-llso67a.svg"
                  className={styles.container3}
                />
              </div>
              <div className={styles.container5}>
                <p className={styles.text4}>点击或拖拽 JSON 文件至此处上传</p>
                <img
                  src="../image/mpy2wnub-03rioqm.svg"
                  className={styles.container4}
                />
                <div className={styles.secondaryOutlineButt}>
                  <p className={styles.text2}>选择文件</p>
                </div>
              </div>
              <p className={styles.text5}>支持 .json 格式，最大 10MB</p>
            </div>
          </div>
          <div className={styles.footerActions}>
            <p className={styles.text6}>取消</p>
            <div className={styles.primaryActionButton}>
              <div className={styles.primaryActionButtonS}>
                <p className={styles.text7}>确认导入</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
