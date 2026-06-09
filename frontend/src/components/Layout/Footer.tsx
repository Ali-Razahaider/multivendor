import { AiFillFacebook, AiFillTwitterCircle, AiFillInstagram, AiFillYoutube } from "react-icons/ai"
import { footerProductLinks } from "../../static/data";
import { footercompanyLinks } from "../../static/data";
import {footerSupportLinks} from "../../static/data";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bg-black text-white ">
      <div className="bg-[#342ac8] text-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center sm:px-12 px-3 py-7">
          <h1 className="lg:text-3xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5 text-justify">
            <span className="text-[#56d879]">
              Subscribe Now! <br />
            </span>
            Get the Latest Deals and Offers.
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter your email"
              required
              className="text-gray-800  bg-amber-50 sm:w-72 w-full py-2.5 rounded px-2 focus:outline-none"
            />
            <button className="bg-[#56d879] hover:bg-teal-500 duration-300 px-5 py-2.5 rounded-md text-white font-medium w-full sm:w-auto whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 py-5  sm:grid-cols-4 md:items-center px-4 sm:px-12  ">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img src="https://1000logos.net/wp-content/uploads/2020/09/SpaceX-Logo.png" alt="" className="" style={{ width: '100%', height: '150px', filter: 'brightness(0) invert(1)' }} />

          <p className="text-white"> Home Elements need to create beautiful designs.</p>

          <div className="flex items-center gap-3 mt-4 justify-center sm:justify-start">
            <AiFillFacebook size={22} className="cursor-pointer hover:text-[#56d879] transition-colors" />
            <AiFillTwitterCircle size={22} className="cursor-pointer hover:text-[#56d879] transition-colors" />
            <AiFillInstagram size={22} className="cursor-pointer hover:text-[#56d879] transition-colors" />
            <AiFillYoutube size={22} className="cursor-pointer hover:text-[#56d879] transition-colors" />
          </div>
        </ul>
        <ul className="text-center p-4 sm:text-start">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link) =>(
          
            <li className="" key={link.name}>
              <Link to={link.link} className="text-gray-400 hover:text-teal-400 duration-300" >{link.name}</Link>
            </li>
            
          ))}
        </ul>
        
        <ul className="text-center p-4 sm:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footercompanyLinks.map((link) =>(
          
            <li className="" key={link.name}>
              <Link to={link.link} className="text-gray-400 hover:text-teal-400 duration-300" >{link.name}</Link>
            </li>
            
          ))}
        </ul>
        <ul className="text-center p-4 sm:text-start">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link) =>(
          
            <li className="" key={link.name}>
              <Link to={link.link} className="text-gray-400 hover:text-teal-400 duration-300" >{link.name}</Link>
            </li>
            
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Footer