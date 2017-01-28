
function newLevel(){
	var PopupWindow=android.widget.PopupWindow;
	var Gravity=android.view.Gravity;
	var WRAP_CONTENT=android.widget.LinearLayout.LayoutParams.WRAP_CONTENT;

	MCViews.runOnUiThread(function(){
		var button=MCViews.createPCButton("sample",{onClick:function(){
				clientMessage("Hello World");
		}});
		var window=new PopupWindow(button,WRAP_CONTENT,WRAP_CONTENT);
		window.showAtLocation(MCViews.activity().getWindow().getDecorView(),Gravity.CENTER,0,0);
	});
}

/*
 MCViews v1.1
 https://github.com/A-og/MCViews
*/

var MCViews=(function(){
	var Runnable=java.lang.Runnable;
	var TextView=android.widget.TextView;
	var Button=android.widget.Button;
	var LinearLayout=android.widget.LinearLayout;
	var FrameLayout=android.widget.FrameLayout;
	var AbsoluteLayout=android.widget.AbsoluteLayout;
	var WRAP_CONTENT=LinearLayout.LayoutParams.WRAP_CONTENT;
	var Bitmap=android.graphics.Bitmap;
	var Rect=android.graphics.Rect;
	var Paint=android.graphics.Paint;
	var Color=android.graphics.Color;
	var Canvas=android.graphics.Canvas;
	var Typeface=android.graphics.Typeface;
	var BitmapFactory=android.graphics.BitmapFactory;
	var BitmapDrawable=android.graphics.drawable.BitmapDrawable;
	var NinePatchDrawable=android.graphics.drawable.NinePatchDrawable;
	var Gravity=android.view.Gravity;
	var OnTouchListener=android.view.View.OnTouchListener;
	var MotionEvent=android.view.MotionEvent;
	var ByteBuffer=java.nio.ByteBuffer;
	var ByteOrder=java.nio.ByteOrder;

	var _activity=()=>com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
	var metrics=_activity().getResources().getDisplayMetrics();
	var density=metrics.density;

	var font=Typeface.createFromAsset(_activity().getAssets(),"fonts/minecraft.ttf");

	var images={};
	var screen={};

	(function(){
		if(metrics.heightPixels>metrics.widthPixels){
			screen.height=metrics.widthPixels;
			screen.width=metrics.heightPixels;
		}else{
			screen.height=metrics.heightPixels;
			screen.width=metrics.widthPixels;
		}
	})();

	(function(){
		images.spritesheet=new BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/gui/spritesheet.png"));
		images.gui=new BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/gui/gui.png"));
		var bitmap;
		var canvas;
		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,8,32,8,8),16*density,16*density,false);
		images.button_off=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,4*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,0,32,8,8),16*density,16*density,false);
		images.button_on=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,4*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(new BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/gui/newgui/ButtonWithBorder.png")),0,0,6,6),12*density,12*density,false);
		images.newbutton_off=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,4*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(new BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/gui/newgui/ButtonWithBorderPressed.png")),0,0,6,6),12*density,12*density,false);
		images.newbutton_on=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,4*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.gui,0,66,200,20),400*density,40*density,false);
		images.pcbutton_off=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,6*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.gui,0,86,200,20),400*density,40*density,false);
		images.pcbutton_on=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,6*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,34,43,14,14),28*density,28*density,false);
		images.background=new NinePatchDrawable(bitmap,createNinePatchChunk(bitmap,6*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(new BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/gui/newgui/TopBar.png")),0,0,5,8),10*density,16*density,false);
		images.header=new NinePatchDrawable(bitmap,createSimpleNinePatchChunk(bitmap,4*density,4*density,10*density,4*density).array(),null,"");

		images.closebutton_off=new BitmapDrawable(Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,60,0,18,18),36*density,36*density,false));

		images.closebutton_on=new BitmapDrawable(Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,78,0,18,18),36*density,36*density,false));
	})();

	function createNinePatchChunk(bitmap,s){
		var top=s,left=s+1,bottom=bitmap.getHeight()-s,right=bitmap.getWidth()-s;
		var buffer=ByteBuffer.allocate(84).order(ByteOrder.nativeOrder());
		buffer.put(0x01);
		buffer.put(0x02);
		buffer.put(0x02);
		buffer.put(0x09);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(left);
		buffer.putInt(right);
		buffer.putInt(top);
		buffer.putInt(bottom);
		buffer.putInt(0);
		buffer.putInt(left);
		buffer.putInt(right);
		buffer.putInt(top);
		buffer.putInt(bottom);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		return buffer;
	}

	function createSimpleNinePatchChunk(bitmap,top,left,bottom,right){
		var bottom=bitmap.getHeight()-bottom;
		var right=bitmap.getWidth()-right;
		var buffer=ByteBuffer.allocate(84).order(ByteOrder.nativeOrder());
		buffer.put(0x01);
		buffer.put(0x02);
		buffer.put(0x02);
		buffer.put(0x09);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(0);
		buffer.putInt(left);
		buffer.putInt(right);
		buffer.putInt(top);
		buffer.putInt(bottom);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		buffer.putInt(0x00000001);
		return buffer;
	}

	function _runOnUiThread(func){
		_activity().runOnUiThread(new Runnable({
			run:function(){
				try{
					func();
				}catch(e){
					clientMessage("Error:"+e);
					print("Error:"+e);
				}
			}
		}));
	}

	function _createButton(text,func){
		var off_image=images.button_off;
		var on_image=images.button_on;
		var off_color=Color.WHITE;
		var on_color=Color.YELLOW;
		var button=new Button(_activity());
		button.setText(text);
		button.setAllCaps(false);
		button.setTextColor(off_color);
		button.setBackgroundDrawable(off_image);
		button.setShadowLayer(1,4,4,Color.DKGRAY);
		if(font!=null)button.setTypeface(font);
		button.setOnTouchListener(new OnTouchListener({
			onTouch:function(view,event){
				var ex=event.getX(),ey=event.getY();
				var action=event.getAction();
				if(ex<0||ey<0||ex>view.getWidth()||ey>view.getHeight()){
					button.setBackground(off_image);
					button.setTextColor(off_color);
				}else{
					if(action==MotionEvent.ACTION_UP){
						button.setBackground(off_image);
						button.setTextColor(off_color);
						func.onClick();
					}else if(action==MotionEvent.ACTION_CANCEL){
						button.setBackground(off_image);
						button.setTextColor(off_color);
					}else if(action==MotionEvent.ACTION_DOWN){
						button.setBackground(on_image);
						button.setTextColor(on_color);
					}
				}
				return false;
			}
		}));
		return button;
	}

	function _createNewButton(text,func){
		var off_image=images.newbutton_off;
		var on_image=images.newbutton_on;
		var off_color=Color.DKGRAY;
		var on_color=Color.WHITE;
		var button=new Button(_activity());
		button.setText(text);
		button.setAllCaps(false);
		button.setTextColor(off_color);
		button.setBackgroundDrawable(off_image);
		if(font!=null)button.setTypeface(font);
		button.setOnTouchListener(new OnTouchListener({
			onTouch:function(view,event){
				var ex=event.getX(),ey=event.getY();
				var action=event.getAction();
				if(ex<0||ey<0||ex>view.getWidth()||ey>view.getHeight()){
					button.setBackground(off_image);
					button.setTextColor(off_color);
				}else{
					if(action==MotionEvent.ACTION_UP){
						button.setBackground(off_image);
						button.setTextColor(off_color);
						func.onClick();
					}else if(action==MotionEvent.ACTION_CANCEL){
						button.setBackground(off_image);
						button.setTextColor(off_color);
					}else if(action==MotionEvent.ACTION_DOWN){
						button.setBackground(on_image);
						button.setTextColor(on_color);
					}
				}
				return false;
			}
		}));
		return button;
	}

	function _createPCButton(text,func){
		var off_image=images.pcbutton_off;
		var on_image=images.pcbutton_on;
		var off_color=Color.WHITE;
		var on_color=Color.YELLOW;
		var button=new Button(_activity());
		button.setText(text);
		button.setAllCaps(false);
		button.setTextColor(off_color);
		button.setBackgroundDrawable(off_image);
		if(font!=null)button.setTypeface(font);
		button.setOnTouchListener(new OnTouchListener({
			onTouch:function(view,event){
				var ex=event.getX(),ey=event.getY();
				var action=event.getAction();
				if(ex<0||ey<0||ex>view.getWidth()||ey>view.getHeight()){
					button.setBackground(off_image);
					button.setTextColor(off_color);
				}else{
					if(action==MotionEvent.ACTION_UP){
						button.setBackground(off_image);
						button.setTextColor(off_color);
						func.onClick();
					}else if(action==MotionEvent.ACTION_CANCEL){
						button.setBackground(off_image);
						button.setTextColor(off_color);
					}else if(action==MotionEvent.ACTION_DOWN){
						button.setBackground(on_image);
						button.setTextColor(on_color);
					}
				}
				return false;
			}
		}));
		return button;
	}

	function _createCloseButton(func){
		var off_image=images.closebutton_off;
		var on_image=images.closebutton_on;
		var button=new Button(_activity());
		button.setBackgroundDrawable(off_image);
		button.setOnTouchListener(new OnTouchListener({
			onTouch:function(view,event){
				var ex=event.getX(),ey=event.getY();
				var action=event.getAction();
				if(ex<0||ey<0||ex>view.getWidth()||ey>view.getHeight()){
					button.setBackground(off_image);
				}else{
					if(action==MotionEvent.ACTION_UP){
						button.setBackground(off_image);
						func.onClick();
					}else if(action==MotionEvent.ACTION_CANCEL){
						button.setBackground(off_image);
					}else if(action==MotionEvent.ACTION_DOWN){
						button.setBackground(on_image);
					}
				}
				return false;
			}
		}));
		return button;
	}

	function _createText(text){
		var textview=new TextView(_activity());
		textview.setText(text);
		textview.setTextColor(Color.WHITE);
		if(font!=null)textview.setTypeface(font);
		return textview;
	}

	function _createBackground(title,func){
		var layout=new LinearLayout(_activity());
		var header=_createHeader(title,func);
		layout.setBackgroundDrawable(images.background);
		layout.setOrientation(LinearLayout.VERTICAL);
		layout.addView(header,WRAP_CONTENT,WRAP_CONTENT);
		return layout;
	}

	function _createHeader(title,func,width){
		if(width==null||width==undefined){
			width=screen.width;
		}
		var header_layout=new FrameLayout(_activity());
		var header=new TextView(_activity());
		var cbutton=_createCloseButton(func);
		var params=new FrameLayout.LayoutParams(screen.height/28.5*density,screen.height/28.5*density);
		params.gravity=Gravity.TOP|Gravity.RIGHT;
		header.setAllCaps(false);
		header.setText(title);
		header.setTextColor(Color.WHITE);
		header.setShadowLayer(1,2,2,Color.DKGRAY);
		header.setGravity(Gravity.CENTER);
		header.setBackgroundDrawable(images.header);
		if(font!=null)header.setTypeface(font);
		header_layout.addView(header,width,screen.height/7);
		header_layout.addView(cbutton,params);
		return header_layout;
	}

	return{
		activity:_activity,
		ScreenSize:screen,
		GuiImages:images,
		runOnUiThread:_runOnUiThread,
		createButton:_createButton,
		createNewButton:_createNewButton,
		createPCButton:_createPCButton,
		createCloseButton:_createCloseButton,
		createText:_createText,
		createBackground:_createBackground,
		createHeader:_createHeader,
	};
})();