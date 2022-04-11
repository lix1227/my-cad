<template>
  <div id="paint-container">
    <div id="paint-sidebar">
      <div id="side-out">
        <span class="iconfont icon-resonserate" @click="toIndex"></span>
      </div>
      <div id="sidebar-document">
        <span class="side-title">文件</span>
        <hr>
        <div class="side-btn">
          <span class="iconfont icon-save-fill" title="保存" @click="saveProject()"></span>
          <span class="iconfont icon-ashbin" title="清空" @click="clearAll($event)"></span>
          <span v-show="isPaint" class="iconfont icon-return" title="返回前一个操作" @click="paintPreStep()" ></span>
          <span v-show="isPaint" class="iconfont icon-return" title="返回后一个操作" @click="paintNextStep()"></span>
        </div>
      </div>
      <div id="sidebar-color">
        <span class="side-title">颜色</span>
        <hr>
        <div class="side-color">
          <label>颜色：</label>
          <colorPicker class="color-picker" v-model="color"  />
          <br>
          <br>
          <label for="line_width">粗细: {{lineWidth}}px</label>
          <input id="line_width" type="range" max="10" min="2" step="1" autocomplete="2" v-model="lineWidth"/>
        </div>
      </div>
      <div id="sidebar-tool">
        <span class="side-title">绘图工具</span>
        <hr>
        <div class="side-btn">
          <span class="iconfont icon-de-isolation" title="取消选择" @click="cancelSel($event)"></span>
          <span class="iconfont icon-line" title="直线" @click="createSingleLine($event)"></span>
          <span class="iconfont icon-24gl-rectangle" title="空心矩形" @click="createRect($event)"></span>
          <span class="iconfont icon-rect" title="实心矩形" @click="createFillRect($event)"></span>
          <span class="iconfont icon-sanjiaoxing" title="三角形" @click="createTriangle($event)"></span>
          <span class="iconfont icon-24gl-circle" title="圆" @click="createCylce($event)"></span>
          <span class="iconfont icon-icon-banyuan" title="半圆" @click="createSemiCycle($event)"></span>
          <span class="iconfont icon-hebing" title="合并"></span>
          <span class="iconfont icon-quzhong" title="去重"></span>
          <span class="iconfont icon-shangse" title="上色"></span>
          <span style="opacity: 0"></span>
        </div>
      </div>
      <div id="sidebar-info">
        <hr>
        <p>创建者: {{proInfo.username}}</p>
        <p>文件名： {{proInfo.projectname}}</p>
        <p>创建时间： {{proInfo.createdate}}</p>
        <p>最新修改： {{proInfo.lastoperate}}</p>
      </div>
    </div>
    <div id="paint-content">
      <div class="paint-content-title">
        <div class="paint-content-title-left">
          <span v-show="isPaint" class="paint_mode mode" @click="changeMode()">绘制模式</span>
          <span v-show="!isPaint" class="show_mode mode"  @click="changeMode()">渲染模式</span>
          <span v-show="isPaint" class="paint-msg">Tips:<strong>“单击”确认绘制起点和终点</strong></span>
          <span v-show="isPaint" class="paint-msg">你目前选择的是:<strong> {{isSelectOp}} </strong></span>
        </div>
        <div class="paint-content-title-right" v-show="isPaint">
          <span class="paint-msg">当前元素：{{this.currentUI.gid}}</span>
          <span class="paint-msg">起点坐标-X：{{UI_ox}}</span>
          <span class="paint-msg">起点坐标-Y：{{UI_oy}}</span>
          <span class="paint-msg">起点与水平夹角：{{UI_ox_deg}}</span>
        </div>
      </div>
      <canvas id="canvas" width="1400" height="700"></canvas>
    </div>

    <!--  图形UI DOM   -->
    <div id="paint-layer" class="paint-layer" v-show="isPaint" @mousemove="isNewCreate || isRotate ? moveGraphUI($event) : 'return false;'"  @click="isNewCreate || isRotate ? setStartAndEndPoint($event) : 'return false;'" ref="paint-layer">

    </div>

    <!--  悬浮按钮  -->
    <div id="paint-btn" v-show="isPaint && isPause">
      <span class="iconfont icon-close" title="取消" @click="paintBtnCancel"></span>
      <span class="iconfont icon-exchangerate" title="旋转" @click="paintBtnRotate"></span>
      <span class="iconfont icon-seleted" title="确认" @click="paintBtnOk"></span>
    </div>
    <!--  UI悬浮信息框（长度与宽度信息）  -->
    <div id="info-width" class="paint-span-info" v-show="isShowWidthInfo">
      <span>{{Math.round((this.currentUI.width) * 100) /100}}</span>
    </div>
    <div id="info-height" class="paint-span-info" v-show="isShowHeightInfo">
      <span>{{Math.round((this.currentUI.height) * 100) /100}}</span>
    </div>
    <!--  弹窗DOM  -->
    <div id="canvas-modal" v-show="isOpenModal">
      <div class="modal-title">
        <h2>{{modal_title}}</h2>
      </div>
      <div class="modal-centen">
        <p>{{modal_content}}</p>
      </div>
      <div class="modal-btn">
        <button class="btn-ok" @click="modalHandleOk()">确认</button>
        <button class="btn-cancel" @click="modalHandleCancel()">取消</button>
      </div>
    </div>
    <div id="canvas-modal-layer" v-show="isOpenModal" ></div>
  </div>
</template>

<script>
import {getProInfo} from "../../request/api";
import Login from "../Login";
export default {
  components: {},
  data() {
    return {
      isRotate:false,                          // 是否需要旋转
      isNewCreate:false,                       // 是否新建UI
      isPause:false,                           // 绘制暂停状态
      isExit:false,                            // 是否退出
      isSave:false,                            // 文件是否已经保存
      isOpenModal:false,                       // 是否打开弹窗
      isShowWidthInfo:false,                   // 是否显示宽度信息
      isShowHeightInfo:false,                  // 是否显示高度信息
      modal_title:"标题",                       // 弹窗标题
      modal_content:"文本",                     // 弹窗文本
      proInfo:{                                // 项目信息
        pid:null,
        projectname:null,
        username:null,
        createdate:null,
        lastoperate:null,
      },
      canvas:null,                              // canvas节点
      gl:null,                                  // webgl上下文
      color:'#000',                             // 颜色选择器颜色
      lineWidth:2,                              // 线段宽度
      vertexShadeSource:'',                     // 顶点着色器源码
      vertexShader:null,                        // 顶点着色器对象
      vertexShaderArr:[0.0, 0.0, 0.0, 1.0],     // 顶点着色器位置数组
      fragShaderSource: '',                     // 片元着色器源码
      fragmentShader:null,                      // 片元着色器对象
      fragmentShaderArr:[0.0, 0.0, 0.0, 1.0],   // 片元着色器颜色数组
      program:null,                             // 程序对象
      isSelectOp:'',                            // 目前选择的操作
      centerX:null,                             // 记录画布中心横坐标
      centerY:null,                             // 记录画布中心纵坐标
      isPaint:false,                            // 是否正在绘制
      isOriginPoint:false,                      // 是否确认绘制起点
      pointNum:0,                               // 绘制的点数量
      paintType:'',                             // 绘制类型
      vertexBuffer:null,                        // 缓冲区
      a_Position:null,                          // 变量位置
      verticesFloat:[],                         // float类型
      operateGraph:[                           // 存放每一个操作的对应图形数据
        // index：int      操作队列位置
        // type：string    图形类型
        // vertex: array   图形的顶点数据
        // color: string   图形颜色
        // num: int        顶点数量
        // over:int       图形是否绘制完
      ],
      recycleDOMList:[],                        // DOM回收箱
      currentDOMList:[],                        // DOM列表
      OriginPoint:{                              // 保存起点位置
        ox:null,
        oy:null,
      },
      currentUI:{                                // 当前操作的UI图形
        type:null,
        gid:null,
        point:{
          ox:null,
          oy:null,
        },
        deg_x:0,
        width:null,
        height:null,
        radius:null
      },
      UIList:[],                                 // UI列表
      recycleUIList:[],                          // UI回收箱
      painTitleInfo:{
        ox:'',
        oy:'',
        ox_deg:'',
        oy_deg:'',
        width:'',
        hegiht:'',
      }
    }
  },
  computed:{
    UI_ox(){
      let ox = this.currentUI.point.ox || this.painTitleInfo.ox
      return Math.round(ox * 100) / 100
    },
    UI_oy(){
      let oy =  this.currentUI.point.oy || this.painTitleInfo.oy
      return Math.round(oy * 100) / 100
    },
    UI_ox_deg(){
      let deg_x = this.currentUI.deg_x || this.painTitleInfo.ox_deg
      return Math.round(deg_x * 100) / 100
    }
  },
  created() {
    this.getProjectInfo();
  },
  mounted() {
    let operateList =  sessionStorage.getItem('operateList');
    if(operateList){
      this.operateGraph = JSON.parse(operateList)
      console.log(this.operateGraph)
    }
    this.initWebGL();
    this.initPaintLayer()
  },
  methods: {
    //返回首页
    toIndex(){
      this.$router.push({path:'/'});
    },
    //获取产品信息
    getProjectInfo(){
      let pid = this.$route.params.pid ? this.$route.params.pid : sessionStorage.getItem('currentPid');
      let username = sessionStorage.getItem("userName");
      getProInfo(pid,username).then(res=>{
        if(res.data.length != 0){
          this.proInfo = res.data[0];
        }
      })
    },

    // 初始化WebGL
    initWebGL(){
      this.canvas = document.getElementById('canvas');
      this.gl = this.canvas.getContext('webgl');
      this.gl.viewport(0,0,this.canvas.width,this.canvas.height);

      // 记录画布中心位置
      let rect = this.canvas.getBoundingClientRect();
      this.centerX = rect.left + this.canvas.width/2;
      this.centerY = rect.top + this.canvas.height/2;

      // 生成着色器源码
      this.createShaderSource();

      // 初始化着色器
      this.initShader(this.gl,this.vertexShadeSource,this.fragShaderSource);

      // 获取a_Position变量位置
      this.a_Position = this.gl.getAttribLocation(this.program,"a_Position");

      //创建缓冲区
      this.vertexBuffer = this.gl.createBuffer();

      if(!this.vertexBuffer){
        console.log("Failed to createthe buffer object");//缓冲区创建失败
        return -1;
      }
      // 将缓冲区绑定到目标对象
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexBuffer);

      if(this.operateGraph && this.operateGraph.length > 0){
        this.readyDraw();
      }
    },
    // 动态生成着色器源码
    createShaderSource(){
      // 定义顶点着色器源码
      this.vertexShadeSource = '' +
        'attribute vec4 a_Position;' +
        'void main(){' +
        '   gl_PointSize=20.0;' +
        '   gl_Position = a_Position;' +
        '}';

      // 定义片元着色器源码
      this.fragShaderSource = '' +
        'void main(){' +
        '   gl_FragColor = vec4(0.0,0.0,0.0,1.0);' +
        '}';
    },
    // 初始化着色器
    initShader(gl,vertexShaderSource,fragShaderSource){
      //创建顶点着色器对象
      this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
      //创建片元着色器对象
      this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      //引入顶点、片元着色器源代码
      gl.shaderSource(this.vertexShader,vertexShaderSource);
      gl.shaderSource(this.fragmentShader,fragShaderSource);
      //编译顶点、片元着色器
      gl.compileShader(this.vertexShader);
      gl.compileShader(this.fragmentShader);

      //创建程序对象
      let _program = gl.createProgram();
      //附着顶点着色器和片元着色器到program
      gl.attachShader(_program,this.vertexShader);
      gl.attachShader(_program,this.fragmentShader);
      //链接program
      gl.linkProgram(_program);
      //使用program
      gl.useProgram(_program);
      //返回程序对象
      this.program =  _program;
    },
    // 清空画布方法
    clearCanvas(){
      this.gl.clearColor(1.0,1.0,1.0,1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },
    // 保持画布信息
    saveProject(){
      console.log('----------')
      console.log(this.UIList)
      console.log(this.currentDOMList)
      console.log('--------------')
    },
    // 彻底清空画布
    clearAll(e){
      this.isSelectOp = e.target.title;
      this.modal_title = "清空画布确认";
      this.modal_content = "是否清空画布？"
      this.openModal();
    },
    // 绘制回退操作
    paintPreStep(){
      if(this.UIList.length === 0){
        return;
      }
      let popUI = this.UIList.pop();
      let popDOM = this.currentDOMList.pop();
      let paintLayer = document.getElementById('paint-layer');

      paintLayer.removeChild(popDOM);

      this.recycleUIList.push(popUI);
      this.recycleDOMList.push(popDOM);
    },
    // 绘制前进操作
    paintNextStep(){
      if(this.recycleUIList.length === 0){
        return;
      }
      let pushUI = this.recycleUIList.pop();
      let pushDOM = this.recycleDOMList.pop();
      let paintLayer = document.getElementById('paint-layer');

      paintLayer.appendChild(pushDOM);

      this.UIList.push(pushUI);
      this.currentDOMList.push(pushDOM);
    },
    readyDraw(){
      console.log(this.operateGraph)
      this.clearCanvas();
      if(this.operateGraph.length > 0) {
        for (let i = 0; i < this.operateGraph.length; i++) {
          let type = this.operateGraph[i].type;
          let arr = this.operateGraph[i].vertex;
          let num = this.operateGraph[i].num;
          switch (type) {
            case this.gl.LINES:
              this.drawGraph(arr,type,num);
              break
            case this.gl.LINE_STRIP:
              this.drawGraph(arr,type,num);
              break
            case this.gl.LINE_LOOP:
              if(this.isSelectOp == '空心矩形' && arr.length != 8){
                  arr = this.scaleRect();
              }
              this.drawGraph(arr, type, num);
              break
            case this.gl.TRIANGLE_STRIP:
              if(arr.length != 8){
                arr = this.scaleFillRect()
              }
              this.drawGraph(arr,type,num);
            default:
              break
          }
        }
      }
      sessionStorage.setItem('operateList',JSON.stringify(this.operateGraph));
    },
    // 绘制图形
    drawGraph(arr,type,num){
      let verticesFloat =arr;
      verticesFloat = new Float32Array(verticesFloat);
      //向缓冲区写入数据
      this.gl.bufferData(this.gl.ARRAY_BUFFER,verticesFloat,this.gl.DYNAMIC_DRAW);
      //将缓冲区对象分配给a_Position; 参数一：传入数据；参数二：指定每个顶点传入多少个数（2表示只取两个数传入，剩下的两个数0.0和1.0补上；1.0是透明度，跟vertexAttrib2f()类似）
      this.gl.vertexAttribPointer(this.a_Position,2,this.gl.FLOAT,false,0,0);
      //连接a_Position变量与分配给它的缓冲区对象
      this.gl.enableVertexAttribArray(this.a_Position);
      this.gl.drawArrays(type, 0, num);
    },


    // 打开弹窗
    openModal(){
      let modalLayer = document.getElementById('canvas-modal-layer');

      modalLayer.style.width = document.body.scrollWidth + "px";
      modalLayer.style.height = document.body.scrollHeight + "px";
      this.isOpenModal = true;
    },
    // 弹窗页面-确认按钮事件
    modalHandleOk(){
      let selType = this.isSelectOp;
      if(selType === '清空'){
        let paintLayer = document.getElementById('paint-layer');

        this.UIList = [];
        paintLayer.innerHTML = '';

        this.isNewCreate = false;
        this.isPause = false;
        this.isOriginPoint = false;
        this.isRotate = false
        this.isSelectOp = '';

        this.clearCanvas();
      }
      this.isOpenModal = false
    },
    // 弹窗页面-取消按钮事件
    modalHandleCancel(){
      let selType = this.isSelectOp;
      if(selType === '清空'){

      }
      this.isOpenModal = false;
    },
    // 初始化UI层位置
    initPaintLayer(){
      let paintLayer = document.getElementById('paint-layer');
      let canvas = document.getElementById('canvas')
      let canvas_p = canvas.getBoundingClientRect();

      paintLayer.style.left = canvas_p.left  + 'px';
      paintLayer.style.top = canvas_p.top + 'px';
    },
    // 取消选择
    cancelSel(){
      let gid = this.currentUI.gid;
      $(`#${gid}`).remove();
      this.initCurrentUI();

      this.isNewCreate = false;
      this.isPause = false;
      this.isOriginPoint = false;
      this.isRotate = false
      this.isSelectOp = '';
    },
    // 创建直线的DOM
    createSingleLine(e){
      this.clearPreOp();

      let paintLayer = document.getElementById('paint-layer');

      //创建直线UI
      let LineDOM =document.createElement('span')
      LineDOM.id = `lineUI${this.UIList.length}`;
      LineDOM.className = 'lineUI graphUI';
      LineDOM.setAttribute('uiType','line');
      LineDOM.style.border = `${this.lineWidth/2}px solid ${this.color}`
      LineDOM.style.borderRadius = `${this.lineWidth/2}px`
      LineDOM.style.backgroundColor = `${this.color}`
      paintLayer.appendChild(LineDOM)

      this.currentUI.gid = $(LineDOM).attr('id')
      this.currentUI.type = 'line'
      this.isPaint = true;
      this.isNewCreate = true;
      this.isSelectOp = e.target.title;
    },
    // 创建空心矩形
    createRect(e){
      this.clearPreOp();

      let paintLayer = document.getElementById('paint-layer');

      //创建矩形UI
      let RectDOM = document.createElement('span')
      RectDOM.id = `rectUI${this.UIList.length}`;
      RectDOM.className = 'rectUI graphUI';
      RectDOM.setAttribute('uiType', 'rect');
      RectDOM.style.border = `${this.lineWidth}px solid ${this.color}`
      paintLayer.appendChild(RectDOM)

      this.currentUI.gid = $(RectDOM).attr('id')
      this.currentUI.type = 'rect'
      this.isPaint = true;
      this.isNewCreate = true;
      this.isSelectOp = e.target.title;
    },
    //创建实心矩形
    createFillRect(e){
      this.clearPreOp();

      let paintLayer = document.getElementById('paint-layer');

      //创建矩形UI
      let RectDOM = document.createElement('span')
      RectDOM.id = `rectFillUI${this.UIList.length}`;
      RectDOM.className = 'fillRectUI graphUI';
      RectDOM.setAttribute('uiType', 'fillRect');
      RectDOM.style.border = `${this.lineWidth}px solid ${this.color}`
      RectDOM.style.backgroundColor = `${this.color}`
      paintLayer.appendChild(RectDOM)

      this.currentUI.gid = $(RectDOM).attr('id')
      this.currentUI.type = 'fillRect'
      this.isPaint = true;
      this.isNewCreate = true;
      this.isSelectOp = e.target.title;
    },
    // 创建圆形UI
    createCylce(e){
      this.clearPreOp();

      let paintLayer = document.getElementById('paint-layer');

      let CycleDOM = document.createElement('span')
      CycleDOM.id = `cycleUI${this.UIList.length}`;
      CycleDOM.className = 'cycleUI graphUI';
      CycleDOM.setAttribute('uiType', 'cycle');
      CycleDOM.style.border = `${this.lineWidth}px solid ${this.color}`
      CycleDOM.style.borderRadius = '50%'
      paintLayer.appendChild(CycleDOM)

      this.currentUI.gid = $(CycleDOM).attr('id')
      this.currentUI.type = 'cycle'
      this.isPaint = true;
      this.isNewCreate = true;
      this.isSelectOp = e.target.title;
    },
    // 创建三角形UI
    createTriangle(e){
      this.clearPreOp();

      let paintLayer = document.getElementById('paint-layer');

      let TriangleDOM = document.createElement('span')
      TriangleDOM.id = `triangleUI${this.UIList.length}`;
      TriangleDOM.className = 'triangleUI graphUI';
      TriangleDOM.setAttribute('uiType','triangle');
      TriangleDOM.style.borderBottomColor = `${this.color}`
      paintLayer.appendChild(TriangleDOM)

      this.currentUI.gid = $(TriangleDOM).attr('id')
      this.currentUI.type = 'triangle'
      this.isPaint = true;
      this.isNewCreate = true;
      this.isSelectOp = e.target.title;
    },
    // 创建半圆UI
    createSemiCycle(e){
      this.clearPreOp();

      let paintLayer = document.getElementById('paint-layer');

      let SemiCycleDOM = document.createElement('span');
      SemiCycleDOM.id = `semiCycleUI${this.UIList.length}`;
      SemiCycleDOM.className = 'semiCycleUI graphUI';
      SemiCycleDOM.setAttribute('uiType','semiCycle');
      SemiCycleDOM.style.backgroundColor = `${this.color}`
      paintLayer.appendChild(SemiCycleDOM);

      this.currentUI.gid = $(SemiCycleDOM).attr('id')
      this.currentUI.type = 'semiCycle'
      this.isPaint = true;
      this.isNewCreate = true;
      this.isSelectOp = e.target.title;
    },
    // 单击事件——确定起点或终点
    setStartAndEndPoint(e){
      let _child =  e.currentTarget.lastElementChild
      let canvas = document.getElementById('canvas')
      let canvas_p = canvas.getBoundingClientRect();

      if(!this.isOriginPoint){
        _child.style.left = e.x-canvas_p.x+'px';
        _child.style.top = e.y-canvas_p.y+'px';
        _child.setAttribute('class','pointUI graphUI')
        this.currentUI.point.ox = this.OriginPoint.ox =e.x-canvas_p.x;
        this.currentUI.point.oy = this.OriginPoint.oy = e.y-canvas_p.y;
        this.isOriginPoint = true;
      }else{
        this.isRotate = false;
        this.isPause = true;
        let deg = this.currentUI.deg_x;
        if(deg < 0){
          $('#paint-btn').css({'left':`${e.x}px`,'top':`${e.y - 40}px`})
        }else{
          $('#paint-btn').css({'left':`${e.x}px`,'top':`${e.y}px`})
        }
      }

    },
    // 移动事件——UI随着鼠标移动
    moveGraphUI(e){
      let canvas = document.getElementById('canvas');
      let canvas_p = canvas.getBoundingClientRect();

      if(this.isNewCreate){
        let _child = this.$refs["paint-layer"].lastElementChild;
        let { ox, oy } = this.OriginPoint;
        if(!this.isOriginPoint && !this.isPause){
          _child.style.left = e.x-canvas_p.x+'px';
          _child.style.top = e.y-canvas_p.y+'px';
          this.painTitleInfo.ox = e.x-canvas_p.x;
          this.painTitleInfo.oy = e.y-canvas_p.y;
        }else if(this.isOriginPoint && !this.isPause){
          let widthSpan = document.getElementById('info-width')
          let heightSpan = document.getElementById('info-height')
          let type = $(_child).attr('uiType');
          if(type === 'line'  || type === 'semiCycle'){
            this.isShowWidthInfo = true;
            let rad = Math.atan2(e.y - canvas_p.y - oy, e.x - canvas_p.x - ox);
            let deg = rad / (Math.PI / 180);
            let _width = Math.abs(e.x-canvas_p.x-ox) / Math.abs(Math.cos(rad));
            $(_child).rotate({
              center:['0%','0%'],
              angle:deg
            })
            if(type === 'semiCycle'){
              $(_child).css({'width': `${_width}px`, 'height':`${_width/2}px`, 'border-radius':`0 0 ${_width/2}px ${_width/2}px`})
              this.currentUI.width = _width;
              this.currentUI.height = _width/2;
              this.currentUI.deg_x = deg;
            }else{
              $(_child).css('width',_width)
              this.currentUI.width = _width;
              this.currentUI.deg_x = deg;
            }
            let span_left = ox + canvas_p.x + (e.x-canvas_p.x-ox) / 2
            let temp =  Math.abs((e.x-canvas_p.x-ox) / 2) * Math.abs(Math.tan(rad));
            let span_top = oy + canvas_p.y + (deg < 0 ? -temp : temp);
            $(widthSpan).css({'left': `${span_left}px`, 'top':`${span_top}px`, 'transform': 'translate(-50%,-100%)'})

          }else if(type === 'rect' || type === 'fillRect' || type === 'cycle' || type === 'triangle'){
            this.isShowWidthInfo = true;
            this.isShowHeightInfo = true;
            let rad = Math.atan2(e.y - canvas_p.y - oy, e.x - canvas_p.x - ox);
            let deg = rad / (Math.PI / 180);
            let _width = Math.abs(e.x-canvas_p.x-ox);
            let _height = Math.abs(e.y-canvas_p.y-oy);
            if(deg<0 && deg>-90){
              let temp = _width;
              _width = _height;
              _height = temp;
              $(_child).rotate({
                center:[0,0],
                angle: 270
              })
            }else if(deg>90 && deg<180){
              let temp = _width;
              _width = _height;
              _height = temp;
              $(_child).rotate({
                center:[0,0],
                angle: 90
              })
            }else if(deg>-180 && deg<-90){
              $(_child).rotate({
                center:[0,0],
                angle: 180
              })
            }else if(deg>0 && deg<90){
              $(_child).rotate({
                center:[0,0],
                angle: 0
              })
            }
            if(type === 'triangle'){
              $(_child).css({'border-left':`${_width/2}px solid transparent`, 'border-right':`${_width/2}px solid transparent`,'border-top':`${_height}px solid ${this.color}`})
            }else {
              $(_child).css({'width':`${_width}px`, 'height':`${_height}px`})
            }

            let span_width_left = ox + canvas_p.x + (e.x-canvas_p.x-ox)/2;
            let span_width_top = oy + canvas_p.y;
            let span_height_left = e.x;
            let span_height_top = e.y - (e.y-canvas_p.y-oy) / 2
            $(widthSpan).css({'left':`${span_width_left}px`, 'top':`${span_width_top}px`,'transform': 'translate(-50%,-50%)'})
            $(heightSpan).css({'left':`${span_height_left}px`, 'top':`${span_height_top}px`,'transform': 'translate(-50%,-50%)'})

            if((deg<0 && deg>-90) || (deg>90 && deg<180)){
              this.currentUI.width = _height;
              this.currentUI.height = _width;
            }else{
              this.currentUI.width = _width;
              this.currentUI.height = _height;
            }

          }
        }
      }
      if(this.isRotate){
        let uiObj = this.currentUI.gid;
        let {ox,oy} = this.currentUI.point;
        let rad = Math.atan2(e.y - canvas_p.y - oy, e.x - canvas_p.x - ox);
        let deg = rad / (Math.PI / 180);
        $(`#${uiObj}`).rotate({
          center:['0%','0%'],
          angle:deg
        })
        this.currentUI.deg_x = deg;
        this.painTitleInfo.ox_deg = deg;
      }
    },
    // 悬浮按钮-确认
    paintBtnOk(){
      let currentUIDOM = document.getElementById(`${this.currentUI.gid}`)
      this.currentDOMList.push(currentUIDOM);
      this.UIList.push(this.currentUI);
      this.initCurrentUI();

      this.isPause = false;
      this.isOriginPoint = false;
      this.isNewCreate = false;
      this.isShowWidthInfo = false;
      this.isShowHeightInfo = false;
    },
    //悬浮按钮-取消
    paintBtnCancel(){
      let gid = this.currentUI.gid;
      $(`#${gid}`).remove();
      this.initCurrentUI();
      this.isPause = false;
      this.isOriginPoint = false;
      this.isNewCreate = false;
      this.isShowWidthInfo = false;
      this.isShowHeightInfo = false;
    },
    //悬浮按钮-旋转
    paintBtnRotate(){
      this.isNewCreate = false;
      this.isRotate = true;
      this.isPause = false;
    },
    // 初始化属性currentUI的值
    initCurrentUI(){
      let current = {
        gid:null,
          point:{
          ox:null,
            oy:null,
        },
        deg_x:0,
        width:null,
        height:null,
      };
      this.currentUI = current;
    },
    // 处理UI组件切换的清空上一个选择
    clearPreOp(){
      if(this.isNewCreate){
        this.paintBtnCancel();
      }
    },
    // 切换渲染和绘制模式
    changeMode(){
      if(this.isPaint && this.currentUI.gid !== null){
        console.log(this.currentUI.gid)
        let id = this.currentUI.gid;
        let child = document.getElementById(`${id}`)
        let paintDom = document.getElementById('paint-layer')
        paintDom.removeChild(child);
      }
      this.isPaint = !this.isPaint;
      this.isNewCreate = false;
      this.isPause = false;
      this.isOriginPoint = false;
      this.isRotate = false
      this.isSelectOp = '';

    },
  },
  beforeRouteLeave(to,from,next){
    if(!this.isSave && !this.isExit){
      this.modal_title = "退出警告";
      this.modal_content = "您还未进行保存，是否退出？";
      this.isSelectOp = '退出';
      this.openModal()
      next(false);
    }else{
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
#paint-container{
  width: 100%;
  height: 92vh;
  display: flex;
}
#paint-sidebar{
  padding: 2vh 1vw;
  width: 10vw;
  height: 88vh;
  border-right: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#side-out{
  width: 100%;
  transform: rotateY(-180deg);
  text-align: right;
  margin-bottom: 10px;
  cursor: pointer;
}
.icon-resonserate{
  color: #87BBFF;
  font-size: 36px;
  transform: rotateY(-180deg);
}
.side-title{
  font-size: 24px;
  font-weight: bolder;
  color: #87BBFF;
}
#sidebar-document{
  margin-bottom: 10px;
}
.side-btn{
  display: flex;
  width: 100%;
  justify-content: space-around;
  flex-wrap: wrap;
}
.side-btn span{
  margin: 5%;
  padding: 2%;
  width: 20%;
  font-size: 24px;
  text-align: center;
  border: 1px solid #87BBFF;
  color: #87BBFF;
  border-radius: 10px;
  cursor: pointer;
}
.icon-return:last-child{
  transform: rotateY(-180deg);
}
.side-btn span:hover{
  background-color: #87BBFF;
  color: #fff;
}
#sidebar-tool{
  flex-grow: 1;
}
#sidebar-info{
  font-size: 14px;
  color: #87BBFF;
}
#sidebar-color{
  margin-bottom: 20px;
}
.side-color{
  color: #87BBFF;
}
.color-picker{
  cursor: pointer;
  margin-left: 10px;
}
#paint-content{
  width: 90vw;
  height: 92vh;
  display: flex;
  padding-left: 4vw;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  background-color: #eee;
}
.paint-content-title{
  width: 65vw;
  height: 12vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.paint-content-title-left, .paint-content-title-right{
  display: flex;
  flex-direction: column;
}
.paint-content-title-right{
  align-items: flex-end;
}
.paint-msg{
  margin-bottom: 10px;
  color: #87BBFF;
}
.mode{
  width: 90px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  border: #000 1px solid;
  margin-bottom: 20px;
  text-align: center;
  color: white;
  cursor: pointer;
}
.paint_mode{
  border: red;
  background-color: red;
}
.show_mode{
  border: #87BBFF;
  background-color: #87BBFF;
}
#canvas{
  width:1400px;
  height:700px;
  background: #fff;
  cursor: pointer;
  -webkit-box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
  -moz-box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
  box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
}
// 悬浮按钮
#paint-btn{
  position: absolute;
  z-index: 15;
}
#paint-btn span{
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #87BBFF;
  color: #fff;
  font-size: 32px;
  border-radius: 15px;
  margin-right: 10px;
  cursor: pointer;
}
// UI悬浮信息框
.paint-span-info{
  background-color: #87BBFF;
  color: #fff;
  position: absolute;
  padding: 2px;
  z-index: 15;
}
// 弹窗图层
#canvas-modal{
  position: absolute;
  z-index: 13;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%,-50%);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.modal-title{
  color: red;
}
.modal-btn{
  width: 100%;
  height: 100px;
  line-height: 100px;
}
.modal-btn button{
  border: 1px #ccc solid;
  outline: none;
  width: 120px;
  height: 40px;
  margin: 0 5px;
  opacity: 0.7;
  color: #fff;
  cursor: pointer;
}
.btn-ok{
  background-color: red;
}
.btn-cancel{
  background-color: #333;
}
#canvas-modal-layer{
  position: absolute;
  left:0;
  top:0;
  z-index:12;
  background:#DCDBDC;
  -moz-opacity: 0.8;
  opacity:.80;
  filter: alpha(opacity=80);/* 只支持IE6、7、8、9 */
}
</style>
<style lang="scss">
//图形UI层
#paint-layer{
  position: absolute;
  z-index: 12;
  width:1400px;
  height:700px;
  overflow: hidden;
}
.pointUI{
  width: 0px;
  height: 2px;
  opacity: 1;
}
.lineUI{
  width: 150px;
  height: 2px;
  opacity: 0.5;
}
.rectUI{
  width: 100px;
  height: 70px;
  opacity: 0.5;
  background-color: transparent;
}
.fillRectUI{
  width: 100px;
  height: 70px;
  opacity: 0.5;
}
.cycleUI{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: transparent;
  opacity: 0.5;
}
.triangleUI{
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 100px solid black;
  opacity: 0.5;
}
.semiCycleUI{
  width: 200px;
  height: 100px;
  background-color: black;
  border-radius:0 0 100px 100px;/* 左上、右上、右下、左下 */
  opacity: 0.5;
}
.graphUI{
  position: absolute;
  z-index: 13;
}
</style >
