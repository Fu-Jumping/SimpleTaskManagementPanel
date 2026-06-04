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
                src="../image/mpy2wzi3-o42u40g.svg"
                className={styles.container2}
              />
            </div>
          </div>
          <div className={styles.tabs}>
            <div className={styles.background}>
              <p className={styles.text2}>导入</p>
              <div className={styles.button2}>
                <p className={styles.text3}>导出</p>
              </div>
            </div>
          </div>
          <div className={styles.container21}>
            <div className={styles.sidebarNavigation}>
              <div className={styles.container6}>
                <p className={styles.text4}>按状态</p>
                <div className={styles.container5}>
                  <div className={styles.button3}>
                    <img
                      src="../image/mpy2wzi3-fe87dor.svg"
                      className={styles.container2}
                    />
                    <p className={styles.text3}>全部</p>
                  </div>
                  <div className={styles.button4}>
                    <img
                      src="../image/mpy2wzi3-g4fdb4f.svg"
                      className={styles.container3}
                    />
                    <p className={styles.text5}>待办</p>
                  </div>
                  <div className={styles.button5}>
                    <img
                      src="../image/mpy2wzi3-2i9utip.svg"
                      className={styles.container4}
                    />
                    <p className={styles.text5}>进行中</p>
                  </div>
                  <div className={styles.button6}>
                    <img
                      src="../image/mpy2wzi3-cb1wwpu.svg"
                      className={styles.container3}
                    />
                    <p className={styles.text5}>已完成</p>
                  </div>
                </div>
              </div>
              <div className={styles.container11}>
                <p className={styles.text4}>按优先级</p>
                <div className={styles.container10}>
                  <div className={styles.button7}>
                    <div className={styles.background2} />
                    <p className={styles.text3}>全部</p>
                  </div>
                  <div className={styles.button8}>
                    <div className={styles.background3} />
                    <img
                      src="../image/mpy2wzi3-df6516o.svg"
                      className={styles.container7}
                    />
                  </div>
                  <div className={styles.button9}>
                    <div className={styles.background4} />
                    <img
                      src="../image/mpy2wzi3-taeeb7v.svg"
                      className={styles.container8}
                    />
                  </div>
                  <div className={styles.button10}>
                    <div className={styles.background5} />
                    <img
                      src="../image/mpy2wzi3-podceus.svg"
                      className={styles.container9}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rightContentPanel}>
              <div className={styles.horizontalBorder}>
                <div className={styles.container12}>
                  <div className={styles.input} />
                  <p className={styles.text6}>全选当前筛选</p>
                </div>
                <div className={styles.container14}>
                  <img
                    src="../image/mpy2wzi3-oiom6kc.svg"
                    className={styles.container13}
                  />
                  <p className={styles.text5}>按日期排序</p>
                </div>
              </div>
              <div className={styles.container20}>
                <div className={styles.container16}>
                  <div className={styles.input2}>
                    <img
                      src="../image/mpy2wzi3-p0kesoo.svg"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.container15}>
                    <p className={styles.text7}>官网首页 UI 设计迭代</p>
                    <p className={styles.a20231120}>2023-11-20</p>
                  </div>
                  <p className={styles.text8}>待办</p>
                </div>
                <div className={styles.container17}>
                  <div className={styles.input2}>
                    <img
                      src="../image/mpy2wzi3-p0kesoo.svg"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.container15}>
                    <p className={styles.text7}>数据导入模块后端接口联调</p>
                    <p className={styles.a20231120}>2023-11-18</p>
                  </div>
                  <div className={styles.background6}>
                    <p className={styles.text9}>进行中</p>
                  </div>
                </div>
                <div className={styles.container19}>
                  <div className={styles.input} />
                  <div className={styles.container18}>
                    <p className={styles.text7}>完成 Q4 季度产品路线图</p>
                    <p className={styles.a20231120}>2023-11-15</p>
                  </div>
                  <div className={styles.background7}>
                    <p className={styles.text10}>已完成</p>
                  </div>
                </div>
                <div className={styles.container16}>
                  <div className={styles.input2}>
                    <img
                      src="../image/mpy2wzi3-clgfn3l.svg"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.container15}>
                    <p className={styles.text7}>API 文档更新与校对</p>
                    <p className={styles.a20231120}>2023-11-12</p>
                  </div>
                  <p className={styles.text8}>待办</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerActions}>
            <p className={styles.text11}>取消</p>
            <div className={styles.button11}>
              <p className={styles.text12}>确认导出</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
