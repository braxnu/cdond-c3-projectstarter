import * as React from 'react';
import { Component } from 'react';
import style from './style.local.css';
import { shouldRender } from 'app/utils/FeatureToggler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export namespace SearchInput {
  export interface Props {
    searchText: string;
    title: string;
    isFetching: boolean;
    onSearchChange(searchText: string): any;
    placeholder?: string;
  }

  export interface State {
    typingTimeout: NodeJS.Timer | number;
    searchText: string;
  }
}

export class SearchInput extends Component<
  SearchInput.Props,
  SearchInput.State
> {
  searchInput: HTMLInputElement | null;
  constructor(props: SearchInput.Props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.searchInput = null;
    this.state = {
      typingTimeout: 0,
      searchText: this.props.searchText,
    };
  }

  componentDidUpdate(prevProps: SearchInput.Props) {
    if (prevProps.searchText !== this.props.searchText) {
      this.setState({
        searchText: this.props.searchText,
      });
    }
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }

  onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout as NodeJS.Timer);
    }
    this.setState({
      searchText: event.target.value,
      typingTimeout: setTimeout(() => {
        const searchText = this.state.searchText;
        const shouldResetSearch =
          searchText.length === 0 &&
          this.state.searchText !== this.props.searchText;
        if (searchText.length >= 3 || shouldResetSearch) {
          this.props.onSearchChange(searchText);
        }
      }, 500),
    });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { searchText, typingTimeout } = this.state;

    if (event.key === 'Enter' && searchText) {
      if (typingTimeout) clearTimeout(typingTimeout as NodeJS.Timer);

      this.props.onSearchChange(searchText);
    }
  };

  render() {
    if (!shouldRender('SearchInput')) return null;

    return (
      <div className={style.searchContainer}>
        <label>
          <b>Search:</b>
        </label>
        <input
          disabled={this.props.isFetching}
          type='text'
          value={this.state.searchText}
          title={this.props.title}
          placeholder={this.props.placeholder}
          onChange={this.onSearchChange}
          onKeyDown={this.handleKeyDown}
          ref={input => {
            this.searchInput = input;
          }}
        />
        {this.props.searchText ? (
          <div
            className={style['clear-button']}
            onClick={() => this.props.onSearchChange('')}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
