import React from 'react';

function Home() {
  return (
    <div className="flex flex-col bg-white">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c93821ba980000b83c02a7320d9bd20e9094bbc6ea1a02acc4ff34996276d85?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
        className="w-full"
        alt="Hero Banner"
      />
      <div className="p-6">
        <h2 className="text-center text-2xl font-bold my-6 font-mr-bedfort text-3xl">Our Collection</h2>
        <p className="text-center mb-10 font-light italic">
          Hãy để những đóa hoa nhung kèm và đất sét lưu niệm của chúng tôi thay
          lời muốn nói, mang đến niềm vui và kỷ niệm đẹp cho những người thân yêu
          của bạn.
        </p>
        <div className="mb-10 relative">
          <h3 className="text-xl font-semibold mb-4">Hoa Nhung Kèm</h3>
          <button className="absolute top-0 right-0 bg-transparent text-black flex items-center">
            <span className="font-bold">See all</span>
            <span className="ml-1">→</span>
          </button>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F060a9c51-965f-4e16-8c68-46e7b10ab10b_431051779_1457659765169386_9028158111614111585_n.jpg?alt=media&token=6082680b-630e-4852-87f1-3364c7aafc1f" alt="Hoa Nhung Kèm 1" className="w-full" />
            <img src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F060a9c51-965f-4e16-8c68-46e7b10ab10b_431051779_1457659765169386_9028158111614111585_n.jpg?alt=media&token=6082680b-630e-4852-87f1-3364c7aafc1f" alt="Hoa Nhung Kèm 2" className="w-full" />
            <img src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F060a9c51-965f-4e16-8c68-46e7b10ab10b_431051779_1457659765169386_9028158111614111585_n.jpg?alt=media&token=6082680b-630e-4852-87f1-3364c7aafc1f" alt="Hoa Nhung Kèm 3" className="w-full" />
          </div>
        </div>
        <div className="mb-10 relative">
          <h3 className="text-xl font-semibold mb-4">Đất Sét</h3>
          <button className="absolute top-0 right-0 bg-transparent text-black flex items-center">
            <span className="font-bold">See all</span>
            <span className="ml-1">→</span>
          </button>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F060a9c51-965f-4e16-8c68-46e7b10ab10b_431051779_1457659765169386_9028158111614111585_n.jpg?alt=media&token=6082680b-630e-4852-87f1-3364c7aafc1f" alt="Đất Sét 1" className="w-full" />
            <img src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F060a9c51-965f-4e16-8c68-46e7b10ab10b_431051779_1457659765169386_9028158111614111585_n.jpg?alt=media&token=6082680b-630e-4852-87f1-3364c7aafc1f" alt="Đất Sét 2" className="w-full" />
            <img src="https://firebasestorage.googleapis.com/v0/b/gahiphop-4de10.appspot.com/o/images%2F060a9c51-965f-4e16-8c68-46e7b10ab10b_431051779_1457659765169386_9028158111614111585_n.jpg?alt=media&token=6082680b-630e-4852-87f1-3364c7aafc1f" alt="Đất Sét 3" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
