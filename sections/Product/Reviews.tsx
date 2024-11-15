import Icon from "../../components/ui/Icon.tsx";

export default function Reviews() {
  return (
    <div class="md:container">
      <div class="bg-white">
        <div class="max-w-7xl mx-auto pt-14 pb-20 px-4 flex flex-col text-[#202020]">
          <div class="flex flex-col items-center mb-4 gap-0.5">
            <div class="flex items-center mb-0.5">
              <Icon id="star" class="text-black" size={26} />
              <Icon id="star" class="text-black" size={26} />
              <Icon id="star" class="text-[#c4c4c4]" size={26} />
              <Icon id="star" class="text-[#c4c4c4]" size={26} />
              <Icon id="star" class="text-[#c4c4c4]" size={26} />
            </div>

            <span class="font-bold">2 STARS</span>
            <span>
              <a href="#/" class="font-bold underline">
                Write a Review
              </a>{" "}
              / 1 Reviews
            </span>
          </div>

          <div class="flex flex-col mb-6 self-start">
            <select
              class="appearance-none border border-[#ccc] text-[#202020] h-8 px-3 w-full text-sm outline-0"
              required
            >
              <option value="" selected disabled>
                SORT BY: -------
              </option>
              <option value="">SORT BY: HIGHEST RATED</option>
              <option value="">SORT BY: LOWEST RATED</option>
              <option value="">SORT BY: NEWEST</option>
            </select>
          </div>

          <div class="flex items-center mb-2">
            <Icon id="star" class="text-black" size={26} />
            <Icon id="star" class="text-black" size={26} />
            <Icon id="star" class="text-[#c4c4c4]" size={26} />
            <Icon id="star" class="text-[#c4c4c4]" size={26} />
            <Icon id="star" class="text-[#c4c4c4]" size={26} />
          </div>

          <span class="text-[#383838] font-bold text-xl block mb-0.5">
            Too narrow!
          </span>
          <span class="text-xs text-[#707070] block mb-1.5">
            amy • December 11, 2023
          </span>
          <span class="max-w-[600px] text-sm">
            I ordered these for my daughter who has an average to thin foot, and
            always a size 8.... She could hardly get her foot into these, and
            when she did- they were PAINFUL... be aware these are super narrow.
            They are cute though.
          </span>
        </div>
      </div>
    </div>
  );
}