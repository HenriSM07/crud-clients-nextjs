"use client"

import { Table, Form } from "rsuite";
import styled from "styled-components";

export const Container = styled.div`
  background-color: gray;
  color: black;
  padding: 1rem;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  overflow-x: auto;

  @media screen and (max-width: 480px) {
    max-width: 350px;
  }

  @media screen and (min-width: 481px) and (max-width: 1024px) {
    max-width: 700px;
  }

  @media screen and (min-width: 1025px) {
    max-width: 1200px;
  }
`;

export const StyledTable = styled(Table)`
  & .rs-table-cell-content {
    white-space: nowrap;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export const MobileRow = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const StyledForm = styled(Form)`
  @media screen and (max-width: 768px) {
    .rs-form-control-wrapper {
      width: 100%;
    }
  }
`;