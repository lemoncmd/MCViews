
var MCViews=(function(){
	var Runnable=java.lang.Runnable;
	var TextView=android.widget.TextView;
	var Button=android.widget.Button;
	var Bitmap=android.graphics.Bitmap;
	var Color=android.graphics.Color;
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

	(function(){
		images.spritesheet=new BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/gui/spritesheet.png"));
		var bitmap;
		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,8,32,8,8),16*density,16*density,false);
		images.button_off=new NinePatchDrawable(bitmap,createNinePatchChunk(2*density,2*density,7*density,7*density).array(),null,"");

		bitmap=Bitmap.createScaledBitmap(Bitmap.createBitmap(images.spritesheet,0,32,8,8),16*density,16*density,false);
		images.button_on=new NinePatchDrawable(bitmap,createNinePatchChunk(2*density,2*density,7*density,7*density).array(),null,"");
	})();
	
	function createNinePatchChunk(top,left,bottom,right){
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

	function _createText(text){
		var textview=new TextView(_activity());
		textview.setText(text);
		textview.setTextColor(Color.WHITE);
		if(font!=null)textview.setTypeface(font);
		return textview;
	}

	return{
		activity:_activity,
		runOnUiThread:_runOnUiThread,
		createButton:_createButton,
		createText:_createText
	};
})();
