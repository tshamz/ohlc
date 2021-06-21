import { Global, css } from '@emotion/react';

export const Styles = () => {
  return <Global styles={styles} />;
};

const styles = css`
  .market-detail {
    display: flex;
    flex-direction: column;
  }

  /**
   * B1, B2, B3, etc.
   */
  body {
    counter-reset: count;
  }

  .market-contract-horizontal-v2__title-container {
    width: auto;
  }

  .market-contract-horizontal-v2__title-text {
    counter-increment: count;
  }

  .market-contract-horizontal-v2__title-text::after {
    content: ' (B' counter(count) ')';
  }

  /**
   * Overrides
   */
  @media screen and (min-width: 64em) {
    .market-detail .market-contract-horizontal-v2 {
      height: 100px !important;
    }
    .market-detail .market-contract-horizontal-v2__image {
      width: 100px !important;
    }
    .market-detail .market-contract-horizontal-v2__content {
      width: calc(100% - 100px) !important;
    }
    .market-detail .market-detail__contracts-header {
      padding-left: 110px !important;
      padding-right: 25px !important;
    }
    .market-detail__contracts-header-col-1,
    .market-detail__contracts-header-col-2,
    .market-detail__contracts-header-col-3,
    .market-detail__contracts-header-col-4 {
      margin: 0 !important;
    }
    .market-detail__contracts-header-col-1 {
      flex-basis: 25%;
    }
    .market-detail__contracts-header-col-2 {
      flex-basis: 18%;
      margin-right: 70px !important;
    }
    .market-detail__contracts-header-col-3 {
      flex: 1;
      margin-left: 70px !important;
    }
    .market-detail__contracts-header-col-4 {
      flex: 1;
      text-align: right;
    }
    .market-detail .market-contract-horizontal-v2__row {
      display: flex !important;
      align-items: center !important;
    }
    .market-detail .market-contract-horizontal-v2__row > *:first-of-type {
      order: -1;
    }
    .market-detail .market-contract-horizontal-v2__row > *:last-child {
      order: 0;
    }
    .market-detail .market-contract-horizontal-v2__row > *:nth-of-type(2) {
      order: 1;
    }
  }

  /**
   * Value formatters
   */

  [data-description='significantly below'] {
    color: #d9534f;
  }
  [data-description='well below'] {
    color: #d9534f;
  }
  [data-description='below'] {
    color: #d9534f;
  }
  [data-description='slightly below'] {
    color: #d9534f;
  }
  [data-description='no change'] {
    color: #000000;
  }
  [data-description='slightly above'] {
    color: #47a447;
  }
  [data-description='above'] {
    color: #47a447;
  }
  [data-description='well above'] {
    color: #47a447;
  }
  [data-description='significantly above'] {
    color: #47a447;
  }

  [data-description='very thin'] {
    color: #000000;
  }
  [data-description='thin'] {
    color: #000000;
  }
  [data-description='light'] {
    color: #000000;
  }
  [data-descriptions='normal'] {
    color: #000000;
  }
  [data-description='active'] {
    color: #000000;
  }
  [data-description='very active'] {
    color: #000000;
  }
  [data-description='significant'] {
    color: #000000;
  }
  [data-description='heavy'] {
    color: #000000;
  }
  [data-description='very heavy'] {
    color: #000000;
  }
`;
