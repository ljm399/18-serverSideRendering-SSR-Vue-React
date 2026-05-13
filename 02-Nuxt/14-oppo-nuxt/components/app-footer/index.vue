<template>
    <div class="app-footer">
      <div class="wrapper content">
        <div class="footer-top">
          <a href="#" class="top-item" v-for="item in footerIcons" :key="item.id">
            <img :src="item.picStr" alt="" />
            <div>{{ item.title }}</div>
          </a>
        </div>
        <div class="footer-center">
          <div class="center-item">
            <ul>
              <li><a class="first" href="">红木家具</a></li>
              <li><a href="">Find N 全新折叠旗舰</a></li>
              <li><a href="">红木家具 Find X5 Pro</a></li>
              <li><a href="">红木家具 Find X5</a></li>
              <li><a href="">红木家具 Reno9 Pro+</a></li>
              <li><a href="">红木家具 Reno9 Pro</a></li>
              <li><a href="">红木家具 Reno9</a></li>
              <li><a href="">红木家具 Reno8</a></li>
              <li><a href="">红木家具 K10x</a></li>
              <li><a href="">红木家具 K10</a></li>
            </ul>
          </div>
          <div class="center-item">
            <ul>
              <li><a class="first" href="">一加</a></li>
              <li><a href="">一加 Ace Pro</a></li>
              <li><a href="">一加 Ace</a></li>
              <li><a href="">一加 Ace 竞速版</a></li>
              <li><a href="">一加 10 Pro</a></li>
              <li><a href="">一加手表</a></li>
              <li><a href="">一加 Buds Pro</a></li>
              <li><a href="">一加 Buds Z2</a></li>
            </ul>
          </div>
          <div class="center-item">
            <ul>
              <li><a class="first" href="">智能硬件</a></li>
              <li><a href="">红木家具 Watch 3</a></li>
              <li><a href="">红木家具 手环 2</a></li>
              <li><a href="">红木家具 Watch 2</a></li>
              <li><a href="">红木家具 Pad</a></li>
              <li><a href="">红木家具 Pad Air</a></li>
              <li><a href="">红木家具 Enco X2</a></li>
              <li><a href="">红木家具 Enco Air2 Pro</a></li>
              <li><a href="">红木家具 Enco Air2</a></li>
            </ul>
          </div>
  
          <div class="connect">
            <img src="~/assets/images/phone.svg" alt="" />
            <span>在线客服</span>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="bottom-item">
            <a href=""> © 2004-2022 红木家具 版权所有粤ICP备14056724号</a>
            <span>|</span> <a href="">隐私政策</a><span>|</span>
            <a href="">用户使用协议</a><span>|</span> <a href="">资质证照</a
            ><span>|</span>
            <a href="">知识产权</a>
          </div>
  
          <div class="bottom-item">
            <img class="police" src="~/assets/images/police.png" alt="police" />
            <a href="#">粤公安网备 44190002001939号</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  interface IFooterIcon {
    id?: number;
    picStr?: string;
    title?: string;
  }
  const props = defineProps({
    footerIcons: {
      type: Array<IFooterIcon>,
      default: () => [
        {
          id: 100,
          picStr: "/images/f-icon1.svg",
          title: "全国联保",
        },
        {
          id: 100,
          picStr: "/images/f-icon2.svg",
          title: "7天无理由退货",
        },
        {
          id: 100,
          picStr: "/images/f-icon3.svg",
          title: "官方换货保障",
        },
        {
          id: 100,
          picStr: "/images/f-icon4.svg",
          title: "满69元包邮",
        },
        {
          id: 100,
          picStr: "/images/f-icon5.svg",
          title: "900+ 家售后网点",
        },
      ],
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .app-footer {
    padding-top: 42px;
    .footer-top {
      height: $footer-top;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      padding-bottom: 40px;
      @include normalFlex();
      justify-content: space-around;
  
      .top-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 17px;
        color: rgba(0, 0, 0, 0.7);
        img {
          margin-bottom: 8px;
        }
      }
    }
  
    .footer-center {
      position: relative;
      height: $footer-center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      margin: 42px 0;
      @include normalFlex();
      justify-content: flex-start;
  
      .center-item {
        /* width: 160px; */
        margin-right: 30px;
  
        a {
          font-size: 17px;
          line-height: 35px;
          white-space: nowrap;
          text-decoration-line: none;
          color: #535355;
          margin-bottom: 12px;
          opacity: 0.8;
        }
        .first {
          opacity: 1;
        }
      }
  
      .connect {
        position: absolute;
        top: 0;
        right: 0;
        height: 51px;
        width: 173px;
  
        display: flex;
        align-items: center;
        justify-content: center;
  
        border-radius: 28px;
        color: #fff;
        font-weight: 500;
        background-color: #000;
        font-size: 15px;
        cursor: pointer;
        img {
          margin-right: 10px;
        }
      }
    }
  
    .footer-bottom {
      height: $footer-bottom;
      margin-bottom: 30px;
  
      .bottom-item {
        margin-top: 14px;
        font-size: 12px;
        margin-right: 3px;
        color: #acabb0;
        a {
          color: #acabb0;
          margin: 0 6px;
        }
  
        .police {
          display: inline-block;
          position: relative;
          top: 4px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .app-footer {
      padding-top: 24px;

      .footer-top {
        height: auto;
        padding-bottom: 20px;
        flex-wrap: wrap;
        gap: 16px 0;

        .top-item {
          width: 33.3333%;
          font-size: 14px;
        }
      }

      .footer-center {
        height: auto;
        margin: 24px 0;
        flex-wrap: wrap;
        gap: 10px 0;
        padding-bottom: 20px;

        .center-item {
          width: 50%;
          margin-right: 0;

          a {
            font-size: 14px;
            line-height: 28px;
          }
        }

        .connect {
          position: static;
          width: 100%;
          margin-top: 12px;
        }
      }

      .footer-bottom {
        height: auto;
        margin-bottom: 20px;

        .bottom-item {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          line-height: 18px;

          a {
            margin: 4px 6px;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .app-footer {
      .footer-top {
        .top-item {
          width: 50%;
        }
      }

      .footer-center {
        .center-item {
          width: 100%;
        }
      }
    }
  }
  </style>
  