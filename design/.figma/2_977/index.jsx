import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame4}>
      <div className={styles.mockBackgroundConten}>
        <div className={styles.container2}>
          <p className={styles.text}>ZenKanban</p>
          <div className={styles.container}>
            <p className={styles.text2}>仪表盘</p>
            <p className={styles.text3}>我的任务</p>
            <div className={styles.linkMargin}>
              <div className={styles.link}>
                <p className={styles.text4}>团队协作</p>
              </div>
            </div>
            <p className={styles.text5}>项目库</p>
          </div>
        </div>
        <div className={styles.container5}>
          <div className={styles.button}>
            <img
              src="../image/mpy2wwtg-ud2336r.svg"
              className={styles.container3}
            />
          </div>
          <div className={styles.button2}>
            <img
              src="../image/mpy2wwtg-9dpf9sv.svg"
              className={styles.container4}
            />
          </div>
          <div className={styles.buttonMargin}>
            <div className={styles.button3}>
              <p className={styles.text6}>新建任务</p>
            </div>
          </div>
          <div className={styles.frame2}>
            <div className={styles.frame} />
          </div>
        </div>
      </div>
      <div className={styles.backdropModalContain}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <p className={styles.text7}>新建任务</p>
            <div className={styles.frame3}>
              <img
                src="../image/mpy2wwtg-3szttkn.svg"
                className={styles.container6}
              />
            </div>
          </div>
          <div className={styles.modalBodyScrollable}>
            <div className={styles.taskTitle}>
              <p className={styles.text8}>任务标题</p>
              <div className={styles.container7}>
                <p className={styles.text9}>输入任务名称...</p>
              </div>
            </div>
            <div className={styles.detailedDescription}>
              <p className={styles.text8}>任务描述</p>
              <div className={styles.container8}>
                <p className={styles.text10}>输入任务描述...</p>
              </div>
            </div>
            <div className={styles.container14}>
              <div className={styles.dueDate}>
                <p className={styles.text8}>截止日期</p>
                <div className={styles.input}>
                  <p className={styles.a20231024}>2023-10-24</p>
                  <div className={styles.container11}>
                    <div className={styles.container10}>
                      <img
                        src="../image/mpy2wwtg-v74kruv.svg"
                        className={styles.container9}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.priority}>
                <p className={styles.text8}>优先级</p>
                <div className={styles.background4}>
                  <div className={styles.button4}>
                    <div className={styles.background} />
                    <p className={styles.text11}>中等</p>
                  </div>
                  <div className={styles.button5}>
                    <div className={styles.background2} />
                    <div className={styles.margin}>
                      <img
                        src="../image/mpy2wwtg-kv2ejx2.svg"
                        className={styles.container12}
                      />
                    </div>
                  </div>
                  <div className={styles.button6}>
                    <div className={styles.background3} />
                    <div className={styles.margin2}>
                      <img
                        src="../image/mpy2wwtg-fkuahxd.svg"
                        className={styles.container13}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <p className={styles.text12}>取消</p>
            <div className={styles.buttonMargin2}>
              <div className={styles.button7}>
                <img
                  src="../image/mpy2wwtg-lwsgp43.svg"
                  className={styles.container6}
                />
                <p className={styles.text13}>保存任务</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
