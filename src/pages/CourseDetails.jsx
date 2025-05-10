import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { HiOutlineGlobeAlt} from "react-icons/hi";
import {BiInfoCircle} from "react-icons/bi";

import RecommendedCourses from "../components/core/Recommendations/RecommendedCourses";
import RatingStars from "../common/RatingStars";
import Spinner from "../common/Spinner";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import ConfirmationModal from "../common/ComnfirmationModal";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import Footer from "../common/Footer";
import ReviewSlider from "../common/ReviewSlideer";
import Error from "./Error";

import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { addTocart } from "../services/operations/cartAPI";
import { setTotalItems } from "../slices/cartSlice";

import { GetAvgRating } from "../utils/avgRating";
import { formatDate } from "../services/formatDate";
import { ACCOUNT_TYPE } from "../utils/constants";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user, loading } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [courseData, setCourseData] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNumberOfLectures, setTotalNumberOfLectures] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState([]);

  // Fetch course details
  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        setCourseData(res);
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    getCourseDetails();
  }, [courseId]);

  // Compute average rating
  useEffect(() => {
    if (courseData?.data?.courseDetails?.ratingAndReviews) {
      const avg = GetAvgRating(courseData.data.courseDetails.ratingAndReviews);
      setAvgReviewCount(avg);
    }
  }, [courseData]);

  // Count lectures
  useEffect(() => {
    const totalLectures = courseData?.data?.courseDetails?.courseContent?.reduce(
      (acc, curr) => acc + (curr?.subSection?.length || 0),
      0
    );
    setTotalNumberOfLectures(totalLectures || 0);
  }, [courseData]);

  const handleActive = (id) => {
    setIsActive((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    );
  };

  const handleBuyCourse = async () => {
    if (token) {
      await buyCourse(token, [courseId], user, navigate, dispatch);
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to Purchase Course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  const handleAddToCart = async () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Instructors cannot purchase courses");
      return;
    }

    if (token) {
      const res = await addTocart({ courseId }, token);
      if (res) dispatch(setTotalItems(totalItems + 1));
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to add courses to your cart",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  if (loading || !courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!courseData.success) return <Error />;

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEntrolled,
    createdAt,
    category,
  } = courseData.data.courseDetails;

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          {/* Header */}
          <div className="mx-auto min-h-[450px] py-8 lg:py-0 xl:max-w-[810px]">
            <div className="text-richblack-300 pb-7 pt-0 lg:pt-7">
              Home / Learning /{" "}
              <span className="text-yellow-50">{category?.name}</span>
            </div>

            {/* Thumbnail for mobile */}
            <div className="block lg:hidden relative max-h-[30rem]">
              <div className="absolute inset-0 shadow-[#161D29_0px_-64px_36px_-28px_inset]" />
              <img
                src={thumbnail}
                alt={courseName}
                className="w-full aspect-square object-cover rounded-md max-h-[30rem]"
              />
            </div>

            <div className="flex flex-col items-center lg:items-start gap-4 text-lg text-richblack-5 py-5">
              <h1 className="text-3xl font-bold sm:text-5xl">{courseName}</h1>
              <p className="text-richblack-200">{courseDescription}</p>

              <div className="flex flex-wrap items-center gap-2 text-md">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>({ratingAndReviews?.length} reviews)</span>
                <span>{studentsEntrolled?.length} students enrolled</span>
              </div>

              <p>Created By {`${instructor?.firstName} ${instructor?.lastName}`}</p>

              <div className="flex flex-wrap gap-5 text-lg">
                <div className="flex items-center gap-2">
                  <BiInfoCircle />
                  <p>Created at {formatDate(createdAt).split("|")[0]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineGlobeAlt />
                  <p>English</p>
                </div>
              </div>
            </div>

            {/* Buttons (mobile only) */}
            <div className="lg:hidden flex flex-col gap-4 border-y border-richblack-500 py-4">
              <p className="text-3xl font-semibold">Rs. {price}</p>
              <button
                onClick={
                  user && studentsEntrolled?.includes(user._id)
                    ? () => navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse
                }
                className="bg-yellow-50 text-richblack-800 rounded-md py-2 hover:scale-105"
              >
                {user && studentsEntrolled?.includes(user._id)
                  ? "Go To Course"
                  : "Buy Now"}
              </button>
              {!studentsEntrolled?.includes(user?._id) && (
                <button
                  onClick={handleAddToCart}
                  className="bg-richblack-800 text-richblack-5 hover:text-yellow-50 rounded-md py-2 hover:scale-105"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* Desktop purchase card */}
          <div className="hidden lg:block absolute right-4 top-[60px] w-1/3 max-w-[410px] min-h-[600px]">
            <CourseDetailsCard
              course={courseData?.data?.courseDetails}
              handleBuyCourse={handleBuyCourse}
              setConfirmationModal={setConfirmationModal}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto box-content px-4 lg:w-[1260px] text-richblack-5">
        <div className="xl:max-w-[810px] lg:mx-0 mx-auto">
          <section className="my-8 border border-richblack-600 p-8">
            <h2 className="text-3xl font-semibold">What you'll learn</h2>
            <div className="mt-5">
              <Markdown>{whatYouWillLearn}</Markdown>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold">Course Content</h2>
            <div className="flex justify-between flex-wrap gap-2 text-richblack-100 mb-4">
              <span>{courseContent.length} section(s)</span>
              <span>{totalNumberOfLectures} lecture(s)</span>
              <span>{courseData?.data?.totalDuration} total length</span>
              <button onClick={() => setIsActive([])} className="text-yellow-25">
                Collapse all sections
              </button>
            </div>

            <div className="py-4">
              {courseContent.map((section, index) => (
                <CourseAccordionBar
                  key={index}
                  course={section}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>
          </section>

          {/* Author */}
          <section className="mb-12 py-4">
            <h2 className="text-3xl font-semibold">Author</h2>
            <div className="flex items-center gap-4 py-4">
              <img
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
                src={
                  instructor?.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName} ${instructor?.lastName}`
                }
              />
              <p className="text-lg">{`${instructor?.firstName} ${instructor?.lastName}`}</p>
            </div>
            <p className="text-richblack-50">{instructor?.additionalDetails?.about}</p>
          </section>
        </div>
      </div>
      
      {/* Recommended Courses */}
      <RecommendedCourses courseId={courseId} />

      {/* Reviews */}
      <section className="w-11/12 mx-auto my-20 max-w-maxContent flex flex-col items-center gap-8 bg-richblack-900 text-white">
        <h2 className="text-4xl font-semibold mt-10 text-center">
          Reviews from other learners
        </h2>
        <ReviewSlider />
      </section>

      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default CourseDetails;
