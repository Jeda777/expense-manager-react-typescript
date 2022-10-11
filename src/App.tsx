import { useState, useEffect } from 'react'
import { Button, Modal, CloseButton, ListGroup, Form, FloatingLabel, Card } from 'react-bootstrap'

const App = () => {
  const [categories, setCategories] = useState<{ name: string; sum: number; expenses: { name: string; amount: number }[] }[]>([
    {
      name: 'Groceries',
      sum: 0,
      expenses: [],
    },
    {
      name: 'Bills',
      sum: 0,
      expenses: [],
    },
    {
      name: 'Entertainment',
      sum: 0,
      expenses: [],
    },
    {
      name: 'Others',
      sum: 0,
      expenses: [],
    },
  ])
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false)
  const [listModalOpen, setListModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [indexToShow, setIndexToShow] = useState(0)
  const [categoryToAdd, setCategoryToAdd] = useState<string>('')
  const [nameOfExpenseToAdd, setNameOfExpenseToAdd] = useState('')
  const [amountOfExpenseToAdd, setAmountOfExpenseToAdd] = useState(0)

  const addCategory = () => {
    if (categoryToAdd === '' || categoryToAdd === null || categoryToAdd === undefined) return
    setCategories([...categories, { name: categoryToAdd, sum: 0, expenses: [] }])
    setCategoryToAdd('')
  }
  const removeCategory = (categoryIndex: number) => {
    const newCategories = categories.filter((i, index) => index !== categoryIndex)
    setCategories(newCategories)
  }
  const showListModal = (index: number) => {
    setListModalOpen(true)
    setIndexToShow(index)
  }
  const showAddModal = (index: number) => {
    setAddModalOpen(true)
    setIndexToShow(index)
  }
  const removeExpense = (expenseIndex: number) => {
    const amountToDecrease = categories[indexToShow].expenses[expenseIndex].amount
    const newExpenses = categories[indexToShow].expenses.filter((i, index) => index !== expenseIndex)
    const newCategories = categories.map((i, index) => {
      if (index === indexToShow) {
        return {
          ...i,
          sum: i.sum - amountToDecrease,
          expenses: newExpenses,
        }
      }
      return i
    })
    setCategories(newCategories)
  }
  const addExpense = () => {
    if (
      nameOfExpenseToAdd === '' ||
      nameOfExpenseToAdd === null ||
      nameOfExpenseToAdd === undefined ||
      amountOfExpenseToAdd === null ||
      amountOfExpenseToAdd === undefined
    )
      return
    const newCategories = categories.map((i, index) => {
      if (index === indexToShow) {
        return {
          ...i,
          sum: i.sum + amountOfExpenseToAdd,
          expenses: [...i.expenses, { name: nameOfExpenseToAdd, amount: amountOfExpenseToAdd }],
        }
      }
      return i
    })
    setCategories(newCategories)
    setNameOfExpenseToAdd('')
    setAmountOfExpenseToAdd(0)
  }

  useEffect(() => {
    const saved = localStorage.getItem('categories')
    if (saved !== null) {
      setCategories(JSON.parse(saved))
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  return (
    <div className='container mx-auto'>
      <div className='d-flex justify-content-between align-items-center px-1 px-sm-0 my-4'>
        <h1>Expenses</h1>
        <Button variant='outline-primary' onClick={() => setCategoriesModalOpen(true)}>
          Categories
        </Button>
      </div>

      <div className='custom-grid px-1 px-sm-0'>
        {categories.map((i, index) => (
          <Card key={i.name}>
            <Card.Body className='d-flex flex-column gap-2'>
              <div className='d-flex justify-content-between align-items-center'>
                <Card.Title>{i.name}</Card.Title>
                <Card.Title>${i.sum.toFixed(2)}</Card.Title>
              </div>
              <div className='d-flex justify-content-end align-items-center gap-2'>
                <Button variant='outline-info' className='px-4' onClick={() => showListModal(index)}>
                  List
                </Button>
                <Button variant='outline-danger' className='px-4' onClick={() => showAddModal(index)}>
                  Add
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={categoriesModalOpen} onHide={() => setCategoriesModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column gap-3'>
          <ListGroup>
            {categories.map((i, index) => (
              <ListGroup.Item key={index} className='d-flex justify-content-between'>
                <p className='mb-0'>{i.name}</p>
                <CloseButton onClick={() => removeCategory(index)} />
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form.Group>
            <FloatingLabel label='Name' className='d-flex w-100'>
              <Form.Control type='text' placeholder='x' value={categoryToAdd} onChange={(e) => setCategoryToAdd(e.target.value)} />
              <Button onClick={addCategory} className='px-4'>
                Add
              </Button>
            </FloatingLabel>
          </Form.Group>
        </Modal.Body>
      </Modal>

      <Modal show={listModalOpen} onHide={() => setListModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{categories[indexToShow].name} list</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column gap-3'>
          {categories[indexToShow].expenses.length !== 0
            ? categories[indexToShow].expenses.map((i, index) => (
                <ListGroup.Item key={index} className='d-flex justify-content-between'>
                  <div className='d-flex gap-4'>
                    <p className='mb-0'>{i.name}</p>
                    <p className='mb-0'>${i.amount}</p>
                  </div>
                  <CloseButton onClick={() => removeExpense(index)} />
                </ListGroup.Item>
              ))
            : 'List is empty.'}
        </Modal.Body>
      </Modal>

      <Modal show={addModalOpen} onHide={() => setAddModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{categories[indexToShow].name} add expense</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column gap-3'>
          <Form.Group className='d-flex flex-column gap-2'>
            <FloatingLabel label='Name' className='d-flex w-100'>
              <Form.Control
                type='text'
                placeholder='x'
                value={nameOfExpenseToAdd}
                onChange={(e) => setNameOfExpenseToAdd(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel label='Amount' className='d-flex w-100'>
              <Form.Control
                type='number'
                inputMode='decimal'
                min={0}
                step={0.01}
                placeholder='x'
                value={amountOfExpenseToAdd}
                onChange={(e) => setAmountOfExpenseToAdd(Number(e.target.value))}
              />
            </FloatingLabel>
          </Form.Group>
          <Button onClick={addExpense} className='px-4'>
            Add
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default App
