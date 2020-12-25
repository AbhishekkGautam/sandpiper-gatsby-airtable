import React, { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import Title from "./Title";
import styled from "styled-components";
import Image from "gatsby-image";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const Slider = () => {
  const query = graphql`
    {
      allAirtable(filter: { table: { eq: "Customers" } }) {
        nodes {
          data {
            name
            quote
            title
            image {
              localFiles {
                childImageSharp {
                  fixed(width: 150, height: 150) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const {
    allAirtable: { nodes: customers },
  } = useStaticQuery(query);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = customers.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, customers]);

  //let hide = "hide"
  return (
    <Wrapper className="section">
      <Title title="reviews" />
      <div className="section-center">
        {customers.map((customer, customerIndex) => {
          const {
            data: { image, name, title, quote },
          } = customer;
          const customerImg = image.localFiles[0].childImageSharp.fixed;

          let position = "nextSlide";
          if (customerIndex === index) {
            position = "activeSlide";
          }
          if (
            customerIndex === index - 1 &&
            index === customerIndex.length - 1
          ) {
            position = "lastSlide";
          }

          //more logic
          return (
            <article className={position} key={customerIndex}>
              <Image fixed={customerImg} className="img"></Image>

              <h4>{name}</h4>
              <p className="title">{title}</p>
              <p className="text">{quote}</p>
              <FaQuoteRight className="icon" />
            </article>
          );
        })}
        <button
          aria-label="Left Arrow"
          className="prev"
          onClick={() => setIndex(index - 1)}
        >
          <FiChevronLeft />
        </button>
        <button
          aria-label="Right Arrow"
          className="next"
          onClick={() => setIndex(index + 1)}
        >
          <FiChevronRight />
        </button>
      </div>
    </Wrapper>
  );
};

//{`prev ${index === 0 ? hide : ""}`}

const Wrapper = styled.div`
  background: var(--clr-grey-10);
  .section-center {
    margin-top: 4rem;
    width: 80vw;
    height: 450px;
    max-width: 800px;
    text-align: center;
    position: relative;
    display: flex;
    overflow: hidden;
    .img {
      border-radius: 50%;
      margin-bottom: 1rem;
    }
    h4 {
      text-transform: uppercase;
      color: var(--clr-primary-5);
      margin-bottom: 0.25rem;
    }
    .title {
      text-transform: capitalize;
      margin-bottom: 0.75rem;
    }
    .text {
      max-width: 40em;
      margin: 0 auto;
      line-height: 2;
      color: var(--clr-grey-5);
    }
    .icon {
      font-size: 3rem;
      margin-top: 1rem;
      color: var(--clr-primary-5);
    }
    .prev,
    .next {
      position: absolute;
      top: 200px;
      transform: translateY(-50%);
      background: var(--clr-grey-5);
      color: var(--clr-white);
      width: 1.25rem;
      height: 1.25rem;
      display: grid;
      place-items: center;
      border-color: transparent;
      font-size: 1rem;
      border-radius: var(--radius);
      cursor: pointer;
      transition: var(--transition);
    }
    .prev:hover,
    .next:hover {
      background: var(--clr-primary-5);
    }
    .prev {
      left: 0;
    }
    .next {
      right: 0;
    }
    /* .hide {
      display: none;
    } */
    @media (min-width: 800px) {
      .prev,
      .next {
        width: 2rem;
        height: 2rem;
        font-size: 1.5rem;
      }
    }
    article {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: var(--transition);
    }
    article.activeSlide {
      opacity: 1;
      transform: translateX(0);
    }
    article.lastSlide {
      transform: translateX(-100%);
    }
    article.nextSlide {
      transform: translateX(100%);
    }
  }
`;
export default Slider;
