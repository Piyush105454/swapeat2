import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

export const OnboardingScreen = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <div className="absolute w-[493px] h-[601px] top-[43px] left-[-118px]">
            <div className="inline-flex flex-col items-center gap-6 absolute top-[473px] left-[137px]">
              <h1 className="relative w-[327px] mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-uigray-80 text-[28px] text-center tracking-[0] leading-8">
                Welcome
              </h1>

              <p className="relative w-[327px] [font-family:'Poppins',Helvetica] font-normal text-[#3a3a3a] text-base text-center tracking-[0] leading-6">
                It&apos;s a pleasure to meet you. We are excited that
                you&apos;re here so let&apos;s get started!
              </p>
            </div>

            <div className="absolute w-[486px] h-[68px] top-[107px] left-0" />

            <img
              className="absolute w-[331px] h-[335px] top-[154px] left-[162px]"
              alt="Illustrations"
              src="/illustrations.png"
            />

            <img
              className="absolute w-[325px] h-[141px] top-0 left-[137px] object-cover"
              alt="Image"
              src="/image-32.png"
            />
          </div>

          <Button 
            onClick={() => navigate('/signup')}
            className="absolute w-[335px] h-12 top-[704px] left-[18px] bg-brandmain rounded-lg h-auto hover:bg-brandmain/90 transition-all duration-200"
          >
            <span className="[font-family:'Yu_Gothic_UI-Bold',Helvetica] font-bold text-[#ffffff] text-sm text-center tracking-[0.80px] leading-6 whitespace-nowrap">
              GET STARTED
            </span>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};