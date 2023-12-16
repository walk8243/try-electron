import Image from 'next/image'
import Head from 'next/head'
import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Heading } from '../components/Heading'

const AboutPage = () => {
  const handleClose = () => {
    window.about?.close()
  }

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Head>
        <title>このアプリについて</title>
      </Head>
      <Heading level={1} hidden>Amethyst</Heading>

      <Grid container alignItems='center' gap={2} sx={{ px: 1, my: 1 }}>
        <Grid item xs='auto'>
          <Image alt='app icon' src='https://walk8243.github.io/amethyst-electron/img/icon.png' width={100} height={100} style={{ marginLeft: 'auto', marginRight: 'auto' }} />
        </Grid>
        <Grid container item direction='column' xs zeroMinWidth gap={2}>
          <Grid container item alignItems='flex-end' gap={1}>
            <Grid item>
              <Typography variant='h3'>Amethyst</Typography>
            </Grid>
            <Grid item>
              <Typography variant='subtitle1'>v0.0.1</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography>関係しているGitHubのIssuesを表示・管理するデスクトップアプリ</Typography>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer sx={{ my: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Version</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Node.js</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Electron</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>React</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Next.js</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Material UI</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container mt={3} justifyContent='center'>
        <Grid item>
          <Button variant='outlined' onClick={handleClose}>閉じる</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutPage
