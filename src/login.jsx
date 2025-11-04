import Auth from "./Auth";
import img1 from "./assets/img1.png";

function LoginPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col  ">
      <div className="border-b border-gray-200"><img src={img1} alt="logo" className="pb-2" /></div>
      

      
      <Auth />
    </div>
  );
}

export default LoginPage;
