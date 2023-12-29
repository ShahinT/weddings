import {IconChevronRight} from "../components/Icons.tsx";
import {useNavigate} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-5 flex flex-col h-screen justify-center md:w-96 md:mx-auto bg-">
        <div className="mb-5 border border-gray-200 rounded-lg bg-white">
          <div className={'image-container'}>
            <img src="https://i.etsystatic.com/14503386/r/il/812afa/3685535734/il_570xN.3685535734_tpyk.jpg"  alt="asd"/>
          </div>
          <div className="p-4">
            <div className="font-bold">If you are a guest</div>
            <div>Scan the QR code you have received</div>
          </div>
        </div>

        <div className="shah-card-hover flex" onClick={() => navigate("/admin")}>
          <div className="flex-1">
            <div className="font-bold">If you own the event </div>
            <div>Click here to login</div>
          </div>
          <div className="flex items-center">
            <IconChevronRight/>
          </div>
        </div>
      </div>
    </>
  )
}
export default Home