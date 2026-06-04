import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame}>
      <div className={styles.mainContent}>
        <div className={styles.searchContextNavigat}>
          <div className={styles.link}>
            <img src="../image/mpy2wlxv-t4gvyjb.svg" className={styles.container} />
            <p className={styles.text}>返回</p>
          </div>
          <div className={styles.paragraph}>
            <p className={styles.text2}>搜索结果：'设计评审'</p>
            <p className={styles.text3}>找到 4 个相关任务</p>
          </div>
        </div>
        <div className={styles.searchResultsGrid}>
          <div className={styles.resultCard1}>
            <p className={styles.text6}>
              <span className={styles.text4}>主页改版&nbsp;</span>
              <span className={styles.text5}>设计评审</span>
            </p>
            <p className={styles.text9}>
              <span className={styles.text7}>
                需要对全新的主页视觉方案进行团队内部的
              </span>
              <span className={styles.text8}>设计评审</span>
              <span className={styles.text7}>
                ，确认组件规范和色彩搭配是否符合品牌调性。
              </span>
            </p>
            <div className={styles.container4}>
              <div className={styles.background}>
                <p className={styles.text10}>高优先级</p>
              </div>
              <div className={styles.container3}>
                <img
                  src="../image/mpy2wlxv-sxzxur8.svg"
                  className={styles.container2}
                />
                <p className={styles.text11}>2023-10-25 14:00</p>
              </div>
            </div>
            <div className={styles.background2} />
          </div>
          <div className={styles.resultCard2}>
            <p className={styles.text6}>
              <span className={styles.text4}>移动端导航&nbsp;</span>
              <span className={styles.text5}>设计评审</span>
            </p>
            <p className={styles.text9}>
              <span className={styles.text7}>
                针对移动端底部导航栏的交互逻辑和图标更新，安排一次快速的
              </span>
              <span className={styles.text8}>设计评审</span>
              <span className={styles.text7}>会议，收集开发团队的反馈。</span>
            </p>
            <div className={styles.container6}>
              <div className={styles.background3}>
                <p className={styles.text12}>中优先级</p>
              </div>
              <div className={styles.container5}>
                <img
                  src="../image/mpy2wlxv-sxzxur8.svg"
                  className={styles.container2}
                />
                <p className={styles.text11}>2023-10-30 10:00</p>
              </div>
            </div>
            <div className={styles.background4} />
          </div>
          <div className={styles.resultCard3}>
            <p className={styles.text6}>
              <span className={styles.text4}>准备&nbsp;</span>
              <span className={styles.text5}>设计评审</span>
              <span className={styles.text4}>&nbsp;材料</span>
            </p>
            <p className={styles.text9}>
              <span className={styles.text7}>
                整理用户调研数据和竞品分析报告，作为周五
              </span>
              <span className={styles.text8}>设计评审</span>
              <span className={styles.text7}>的辅助背景资料。</span>
            </p>
            <div className={styles.container8}>
              <div className={styles.background5}>
                <p className={styles.text13}>低优先级</p>
              </div>
              <div className={styles.container7}>
                <img
                  src="../image/mpy2wlxv-sxzxur8.svg"
                  className={styles.container2}
                />
                <p className={styles.text11}>2023-10-26 18:00</p>
              </div>
            </div>
            <div className={styles.background6} />
          </div>
          <div className={styles.resultCard4}>
            <div className={styles.paragraph2}>
              <p className={styles.text15}>
                <span className={styles.text14}>注册流程&nbsp;</span>
                <span className={styles.text5}>设计评审</span>
              </p>
              <img src="../image/mpy2wlxv-a515xxt.svg" className={styles.icon} />
            </div>
            <p className={styles.text9}>
              <span className={styles.text7}>
                新版注册表单的可用性测试结果汇报及
              </span>
              <span className={styles.text8}>设计评审</span>
              <span className={styles.text7}>。</span>
            </p>
            <div className={styles.container10}>
              <div className={styles.background3}>
                <p className={styles.text12}>中优先级</p>
              </div>
              <div className={styles.margin}>
                <div className={styles.container9}>
                  <img
                    src="../image/mpy2wlxv-sxzxur8.svg"
                    className={styles.container2}
                  />
                  <p className={styles.text11}>2023-10-20 15:00</p>
                </div>
              </div>
            </div>
            <div className={styles.background7} />
          </div>
        </div>
      </div>
      <div className={styles.container11}>
        <div className={styles.input}>
          <p className={styles.text16}>设计评审</p>
          <img src="../image/mpy2wlxw-oxen4l9.svg" className={styles.icon2} />
          <div className={styles.button}>
            <p className={styles.text17}>搜索</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
