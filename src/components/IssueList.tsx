import React, {useEffect, useState} from 'react';
import {gql, useQuery} from '@apollo/client'
import './style.css'
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import moment from 'moment'


const query = gql`
    query {
        viewer {
            login
            issues(first: 20) {
                pageInfo {
                    endCursor
                    startCursor
                }
                totalCount
                nodes {
                    id
                    title
                    publishedAt
                    number
                    closedAt
                    comments{
                       totalCount
                    }
                  }
            }
        }
    }`
const IssueList = () => {


    const {loading, data} = useQuery(query)
    const [currentPage, setcurrentPage] = useState(
        1)
    const [todosPerPage, settodosPerPage] = useState(
        5)
    const [filter, setFilter] = useState()
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    let currentTodos = data?.viewer?.issues?.nodes.slice(indexOfFirstTodo, indexOfLastTodo);
    let issuesCount = data?.viewer?.issues?.totalCount ?? ''

    const renderTodos = (filter === 'close') ? currentTodos?.filter((todo: any) =>
        todo.title.toLowerCase().includes(filter)) : currentTodos?.map((todo: any) => {
        return <div className='issue__display-container-item'
                    key={todo?.id}>
            <ErrorOutline className='issue-icon'/>
            <div className='issue__text-row'>
                <div>
                    <h4 className='issue__display-container-item-title'>{todo?.title}</h4>
                    <span>#{todo?.number} opened {moment(todo.publishedAt).fromNow()} by {data?.viewer?.login}</span>
                </div>
                {todo?.comments?.totalCount ?
                    <div className='c-center'>
                        <ChatBubbleOutline className='comment-icon pr-8'/>
                        <span>{todo?.comments?.totalCount}</span>
                    </div> : ''}
            </div>
        </div>;
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(issuesCount / todosPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleClick = (event: any) => {
        setcurrentPage(event.target.id)
        let pageNumber: any = document.getElementById(event.target.id);
        let list: any = document.getElementsByClassName("pagination__item");
        if(event.target.id === pageNumber.innerHTML){
            pageNumber.classList.add("pagination__item-active")
        }
        for (let i = 0; i < list.length; i++) {
            list[i].addEventListener("click", function() {
                let current = document.getElementsByClassName("pagination__item-active");
                if (current.length > 0) {
                    current[0].className = current[0].className.replace(" pagination__item-active", "");
                }
            });
        }
    }

    const handleFilter = (event: any) => {
        const issueType: any = ((event.target.value === 'close' && data.viewer.issues.nodes.closedAt !== null) ? 'close' : 'open')
        setFilter(issueType)
    }

    const options = [
        {
            label: "Open Issues",
            value: "open",
        },
        {
            label: "Close Issues",
            value: "close",
        },
    ];

    const renderPageNumbers = pageNumbers.map((number: any) => {
        return (
            <li className='pagination__item'
                key={number}
                id={number}
                onClick={handleClick}
            >
                {number}
            </li>
        );
    });

    useEffect(() => {
    }, [data])

    return (
        <>
            <div className='issue__display'>
                <div className='filter__display-container'>
                    <select value={filter} onChange={handleFilter}
                            className='filter__display-container-header cursor-pointer'>
                        {options.map((option) => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className='issue__display-container'>
                    <div className='issue__display-container-header'>
                        <ErrorOutline className='pr-8'/>
                        <span className='issue__display-container-item-title'>{issuesCount} open</span>
                    </div>
                    <div>{renderTodos}</div>
                </div>
                <ul id="page-numbers" className='pagination'>
                    {renderPageNumbers}
                </ul>
            </div>
        </>
    );
}

export default IssueList;
