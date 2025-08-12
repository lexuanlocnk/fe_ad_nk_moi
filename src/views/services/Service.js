import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CContainer, CFormCheck, CImage, CRow, CTable } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'

import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import moment from 'moment'

function Service() {
  const navigate = useNavigate()

  const [dataService, setDataService] = useState([])

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // search input
  const [dataSearch, setDataSearch] = useState('')

  const handleAddNewClick = () => {
    navigate('/service/add')
  }

  const handleEditClick = (id) => {
    navigate(`/service/edit?id=${id}`)
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataService(keyword)
  }

  const fetchDataService = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`admin/service?data=${dataSearch}`)

      if (response.data.status === true) {
        setDataService(response.data.list)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch intro data is error', error)
    }
  }

  useEffect(() => {
    fetchDataService()
  }, [])

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    if (newPage < 2) {
      setPageNumber(newPage)
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, 0)
    setPageNumber(newPage)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/service/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataService()
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete service id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  // deleted all checkbox
  const handleDeleteSelectedCheckbox = async () => {
    try {
      const response = await axiosClient.post('admin/delete-all-service', {
        data: selectedCheckbox,
      })
      if (response.data.status === true) {
        toast.success('Xóa tất cả các mục thành công!')
        fetchDataService()
        setSelectedCheckbox([])
      }
    } catch (error) {
      console.error('Deleted all id checkbox is error', error)
    }
  }

  const items =
    dataService?.data && dataService?.data?.length > 0
      ? dataService?.data.map((item) => ({
          id: (
            <CFormCheck
              key={item?.service_id}
              aria-label="Default select example"
              defaultChecked={item?.service_id}
              id={`flexCheckDefault_${item?.service_id}`}
              value={item?.service_id}
              checked={selectedCheckbox.includes(item?.service_id)}
              onChange={(e) => {
                const serviceId = item?.service_id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, serviceId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== serviceId))
                }
              }}
            />
          ),
          title: (
            <div
              style={{
                width: 300,
              }}
              className="blue-txt"
            >
              {item?.service_desc?.title}
            </div>
          ),
          image: (
            <CImage
              className="border"
              src={`${imageBaseUrl}${item.picture}`}
              alt={`Ảnh intro ${item?.service_id}`}
              width={100}
              height={80}
              loading="lazy"
            />
          ),
          url: <div>{item?.service_desc?.friendly_url}</div>,
          create: moment.unix(item?.date_post).format('hh:mm A, DD/MM/YYYY'),
          actions: (
            <div
              style={{
                width: 100,
              }}
            >
              <button
                onClick={() => handleEditClick(item.service_id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.service_id)
                }}
                className="button-action bg-danger"
              >
                <CIcon icon={cilTrash} className="text-white" />
              </button>
            </div>
          ),
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

  const columns = [
    {
      key: 'id',
      label: (
        <>
          <CFormCheck
            aria-label="Select all"
            checked={isAllCheckbox}
            onChange={(e) => {
              const isChecked = e.target.checked
              setIsAllCheckbox(isChecked)
              if (isChecked) {
                const allIds = dataService?.data.map((item) => item.service_id) || []
                setSelectedCheckbox(allIds)
              } else {
                setSelectedCheckbox([])
              }
            }}
          />
        </>
      ),
      _props: { scope: 'col' },
    },

    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },

    {
      key: 'image',
      label: 'Hình ảnh',
      _props: { scope: 'col' },
    },

    {
      key: 'url',
      label: 'Chuỗi đường dẫn',
      _props: { scope: 'col' },
    },

    {
      key: 'create',
      label: 'Ngày khởi tạo',
      _props: { scope: 'col' },
    },

    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  return (
    <CContainer>
      {!isPermissionCheck ? (
        <h5>
          <div>Bạn không đủ quyền để thao tác trên danh mục quản trị này.</div>
          <div className="mt-4">
            Vui lòng quay lại trang chủ <Link to={'/dashboard'}>(Nhấn vào để quay lại)</Link>
          </div>
        </h5>
      ) : (
        <>
          <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />

          <CRow className="mb-3">
            <CCol>
              <h2>QUẢN LÝ DỊCH VỤ</h2>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <CButton
                  onClick={handleAddNewClick}
                  color="primary"
                  type="submit"
                  size="sm"
                  className="button-add"
                >
                  Thêm mới
                </CButton>
                <Link to={'/introduce'}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <table className="filter-table">
                <thead>
                  <tr>
                    <th colSpan="2">
                      <div className="d-flex justify-content-between">
                        <span>Bộ lọc tìm kiếm</span>
                        <span className="toggle-pointer" onClick={handleToggleCollapse}>
                          {isCollapse ? '▼' : '▲'}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                {!isCollapse && (
                  <tbody>
                    <tr>
                      <td>Tổng cộng</td>
                      <td className="total-count">{dataService?.total}</td>
                    </tr>
                    <tr>
                      <td>Tìm kiếm</td>
                      <td>
                        <input
                          type="text"
                          className="search-input"
                          value={dataSearch}
                          onChange={(e) => setDataSearch(e.target.value)}
                        />
                        <button onClick={() => handleSearch(dataSearch)} className="submit-btn">
                          Submit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </CCol>

            <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                Xóa vĩnh viễn
              </CButton>
            </CCol>

            <CCol>
              <CTable hover className="mt-3" columns={columns} items={items} />
              <div className="d-flex justify-content-end">
                <ReactPaginate
                  pageCount={Math.ceil(dataService?.total / dataService?.per_page)}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  onPageChange={handlePageChange}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  previousLabel={'<<'}
                  nextLabel={'>>'}
                />
              </div>
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default Service
