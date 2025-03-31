import styled from "styled-components";

export const Container = styled.div`
    background-color: "black";
    color: "pink";
    padding: 1rem;
    width: 100%;
    overflow-x: auto;

    /*Celular*/
    @media screen and (max-width: 480px) {
        max-width: 350px;
    }

    /*Tablet*/
    @media screen and (min-width: 481px) and (max-width: 1024px) {
        max-width: 700px;
    }

    /*Desktop*/
    @media screen and (min-width: 1025px) {
        max-width: 1200px;
    }
`;
