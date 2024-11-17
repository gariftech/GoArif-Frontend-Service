"use client";

import Button from "../components/Button";
import Link from "next/link";
import { MotionDiv, MotionImg, MotionSpan } from "../libs/motion/motion";

const Home = () => {

  return (
    <div
      data-theme={"skinLight"}
      className={"bg-[url('/images/bg-intro.webp')] bg-cover"}
    >
      <div
        data-theme={"skinLight"}
        className={
          "p-4 md:p-16 flex flex-col md:flex-row h-screen bg-transparent max-w-screen-2xl justify-center md:justify-between mx-auto items-center gap-12 md:gap-0 "
        }
      >
        <div
          // data-theme="skinLight"
          className="flex flex-col items-start justify-center px-2 py-8 md:py-0 gap-0 md:gap-4"
        >
          {/*<SvgTwillinkLogo height={30} className="fill-logo" />*/}

          <h1 className="text-start text-2xl md:text-4xl font-bold text-primary leading-relaxed">
            <MotionSpan
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.25,
              }}
              className={"block"}
            >
              Your exceptional{" "}
            </MotionSpan>
            <MotionSpan
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.25,
                delay: 0.25,
              }}
              className={"block"}
            >
              AI Data Science
            </MotionSpan>
          </h1>
          <MotionDiv
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 0.25,
              delay: 0.75,
            }}
          >
            <h2 className="text-primary text-xl md:text-[20px] font-normal leading-relaxed mb-4">
              Join with us now
            </h2>
          </MotionDiv>
          {false ? (
            <MotionDiv
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.25,
                delay: 1,
              }}
            >
              <Link href="/admin">
                <div>Go to Admin</div>
              </Link>
            </MotionDiv>
          ) : (
            <MotionDiv
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.25,
                delay: 1,
              }}
              className={"flex flex-row  items-center gap-4"}
            >
              <div>
                <Link href="/auth/register">
                  <div>Create your account</div>
                </Link>
              </div>
              <div>
                <p className={""}>or</p>
              </div>
              <div>
                <Link href="/auth/login" className="hover:underline">
                  <Button title={"Login"}/>
                </Link>
              </div>
            </MotionDiv>
          )}
        </div>
        <div>
          <div className={"relative mr-10"}>
            <div>
              <MotionImg
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.5,
                  delay: 1,
                }}
                src='/images/logo.png'
                alt="Preview"
                className={"w-[200px] md:w-200"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
