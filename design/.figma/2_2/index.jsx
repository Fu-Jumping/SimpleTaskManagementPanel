import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame6}>
      <div className={styles.topHeader}>
        <div className={styles.container}>
          <p className={styles.text}>任务管理</p>
          <div className={styles.overlayShadow}>
            <div className={styles.button}>
              <p className={styles.text2}>状态</p>
            </div>
            <p className={styles.text3}>优先级</p>
          </div>
        </div>
        <div className={styles.container3}>
          <div className={styles.input}>
            <div className={styles.container2}>
              <p className={styles.text4}>搜索任务标题或描述</p>
            </div>
            <img src="../image/mpy2wdne-kkb7kfl.svg" className={styles.symbol} />
            <div className={styles.button2}>
              <p className={styles.text5}>搜索</p>
            </div>
          </div>
        </div>
        <div className={styles.container6}>
          <div className={styles.button3}>
            <img
              src="../image/mpy2wdne-ylfeawt.svg"
              className={styles.container4}
            />
            <p className={styles.text6}>筛选</p>
          </div>
          <div className={styles.button4}>
            <div className={styles.buttonShadow}>
              <p className={styles.text7}>+</p>
              <p className={styles.text8}>新建任务</p>
            </div>
          </div>
          <div className={styles.button5}>
            <img
              src="../image/mpy2wdne-2y4sd93.svg"
              className={styles.container5}
            />
          </div>
        </div>
      </div>
      <div className={styles.mainKanbanBoard}>
        <div className={styles.frame}>
          <div className={styles.container10}>
            <div className={styles.container8}>
              <img
                src="../image/mpy2wdne-619heog.svg"
                className={styles.container7}
              />
              <p className={styles.text9}>待处理</p>
            </div>
            <div className={styles.background}>
              <p className={styles.text10}>3</p>
            </div>
            <div className={styles.container9}>
              <p className={styles.text11}>+</p>
            </div>
          </div>
          <div className={styles.overlayShadow2}>
            <div className={styles.taskCard1}>
              <div className={styles.taskCard1Shadow}>
                <div className={styles.container14}>
                  <p className={styles.text12}>数据库迁移方案</p>
                  <div className={styles.container13}>
                    <div className={styles.button6}>
                      <img
                        src="../image/mpy2wdne-hdsa8bd.svg"
                        className={styles.container11}
                      />
                    </div>
                    <div className={styles.button6}>
                      <img
                        src="../image/mpy2wdne-5b9cn4k.svg"
                        className={styles.container11}
                      />
                    </div>
                    <div className={styles.button7}>
                      <img
                        src="../image/mpy2wdne-2a5kpql.svg"
                        className={styles.container12}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.container15}>
                  <p className={styles.text13}>
                    规划并执行生产环境 MySQL 数据库向云服
                    <br />
                    务端的整体迁移与优化。
                  </p>
                </div>
                <div className={styles.horizontalBorder}>
                  <div className={styles.background2}>
                    <img
                      src="../image/mpy2wdne-1a5mug5.svg"
                      className={styles.container16}
                    />
                    <p className={styles.text14}>高优先</p>
                  </div>
                  <div className={styles.container19}>
                    <img
                      src="../image/mpy2wdne-i6xypuc.svg"
                      className={styles.container17}
                    />
                    <div className={styles.container18}>
                      <p className={styles.text15}>10-25</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.taskCard2}>
              <div className={styles.taskCard2Shadow}>
                <div className={styles.container14}>
                  <p className={styles.text12}>用户手册编写</p>
                  <div className={styles.container13}>
                    <div className={styles.button6}>
                      <img
                        src="../image/mpy2wdne-hdsa8bd.svg"
                        className={styles.container11}
                      />
                    </div>
                    <div className={styles.button6}>
                      <img
                        src="../image/mpy2wdne-5b9cn4k.svg"
                        className={styles.container11}
                      />
                    </div>
                    <div className={styles.button7}>
                      <img
                        src="../image/mpy2wdne-2a5kpql.svg"
                        className={styles.container12}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.container20}>
                  <p className={styles.text16}>
                    完成 2.0 版本的核心功能操作指南，包含截
                    <br />
                    图与常见问题解答。
                  </p>
                </div>
                <div className={styles.horizontalBorder2}>
                  <div className={styles.background3}>
                    <img
                      src="../image/mpy2wdnf-k9slj3l.svg"
                      className={styles.container16}
                    />
                    <p className={styles.text17}>中优先</p>
                  </div>
                  <div className={styles.container19}>
                    <img
                      src="../image/mpy2wdne-i6xypuc.svg"
                      className={styles.container17}
                    />
                    <div className={styles.container18}>
                      <p className={styles.text15}>11-02</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame3}>
          <div className={styles.frame2}>
            <div className={styles.container22}>
              <div className={styles.container21}>
                <img
                  src="../image/mpy2wdnf-ekt7qls.svg"
                  className={styles.container11}
                />
                <p className={styles.text9}>进行中</p>
              </div>
              <div className={styles.overlay}>
                <p className={styles.text18}>1</p>
              </div>
              <div className={styles.container9}>
                <p className={styles.text11}>+</p>
              </div>
            </div>
            <div className={styles.overlayShadow4}>
              <div className={styles.backgroundBorder}>
                <div className={styles.overlayShadow3}>
                  <div className={styles.container23}>
                    <p className={styles.text19}>核心 API 重构</p>
                    <div className={styles.container13}>
                      <div className={styles.button6}>
                        <img
                          src="../image/mpy2wdne-hdsa8bd.svg"
                          className={styles.container11}
                        />
                      </div>
                      <div className={styles.button6}>
                        <img
                          src="../image/mpy2wdne-5b9cn4k.svg"
                          className={styles.container11}
                        />
                      </div>
                      <div className={styles.button7}>
                        <img
                          src="../image/mpy2wdne-2a5kpql.svg"
                          className={styles.container12}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.container24}>
                    <p className={styles.text20}>
                      正在优化鉴权模块与数据流响应速度，目前
                      <br />
                      完成度 60%。
                    </p>
                  </div>
                  <div className={styles.horizontalBorder3}>
                    <div className={styles.background2}>
                      <img
                        src="../image/mpy2wdne-1a5mug5.svg"
                        className={styles.container16}
                      />
                      <p className={styles.text14}>高优先</p>
                    </div>
                    <div className={styles.container26}>
                      <img
                        src="../image/mpy2wdnf-249xbzf.svg"
                        className={styles.container25}
                      />
                      <div className={styles.container18}>
                        <p className={styles.text15}>进行中</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame5}>
          <div className={styles.frame4}>
            <div className={styles.container29}>
              <div className={styles.container28}>
                <img
                  src="../image/mpy2wdnf-dliasf7.svg"
                  className={styles.container27}
                />
                <p className={styles.text9}>已完成</p>
              </div>
              <div className={styles.background4}>
                <p className={styles.text21}>2</p>
              </div>
              <div className={styles.container9}>
                <p className={styles.text11}>+</p>
              </div>
            </div>
            <div className={styles.overlayShadow6}>
              <div className={styles.backgroundBorder2}>
                <div className={styles.overlayShadow5}>
                  <div className={styles.container30}>
                    <p className={styles.text22}>图标库更新</p>
                    <div className={styles.container13}>
                      <div className={styles.button6}>
                        <img
                          src="../image/mpy2wdnf-84ghnql.svg"
                          className={styles.container11}
                        />
                      </div>
                      <div className={styles.button6}>
                        <img
                          src="../image/mpy2wdne-5b9cn4k.svg"
                          className={styles.container11}
                        />
                      </div>
                      <div className={styles.button7}>
                        <img
                          src="../image/mpy2wdne-2a5kpql.svg"
                          className={styles.container12}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.container31}>
                    <p className={styles.text23}>
                      同步了最新的 Material Design 图标到前端
                      <br />
                      资源目录。
                    </p>
                  </div>
                  <div className={styles.horizontalBorder4}>
                    <div className={styles.background5}>
                      <img
                        src="../image/mpy2wdnf-77j9l39.svg"
                        className={styles.container16}
                      />
                      <p className={styles.text24}>低优先</p>
                    </div>
                    <div className={styles.container34}>
                      <img
                        src="../image/mpy2wdnf-8biw0kq.svg"
                        className={styles.container32}
                      />
                      <div className={styles.container33}>
                        <p className={styles.text25}>10-15</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
