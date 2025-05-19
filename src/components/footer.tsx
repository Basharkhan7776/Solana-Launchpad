import { Separator } from "@/components/ui/separator";
import {
  GithubIcon,
  Linkedin,
  TwitterIcon,
} from "lucide-react";
import { Logo } from "./logo";


const Footer = () => {
  return (
    <div className="">
      <footer>
        <div className="md:px-[20%]">
          <div className="py-8 flex flex-col justify-start items-center ">
            {/* Logo */}
            <Logo textSize="3xl"/>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-secondary-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <a href="https://www.basharkhan.in" target="_blank" className=" text-primary">
                Bashar Khan
              </a>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-secondary-foreground">
              <a href="https://x.com/_Bashar_khan_" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/bashar-khan-ba2564291/" target="_blank">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/Basharkhan7776" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
